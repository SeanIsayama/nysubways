<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import Scroller from "@sveltejs/svelte-scroller";
  import Map from "./Map.svelte";
  import Line from "./Line.svelte";
  import { geoMercator } from "d3-geo";
  import Graph from "./Graph.svelte";

  let count, index, offset, progress;
  let width, height;
  /////////////////////////////////
  let busyness = 0;
  let data = [];
  let topStations = [];

  const hours = Array.from({ length: 24 }, (_, i) => i);


  function updateHour() {
    fetchData(busyness);
  }

  async function fetchData(busyness) {
    const res = await fetch(`https://raw.githubusercontent.com/SeanIsayama/nysubways/main/src/data/ridership_by_hour.csv`);
    const text = await res.text();
    const data = d3.csvParse(text);
    const filteredData = data.filter(entry => {
        // Extract the hour from the transit_timestamp
        const timestamp = new Date(entry.transit_timestamp);
        const hour = timestamp.getHours();
        // Compare the extracted hour with the selected hour
        return hour === busyness;
    });
    // Update the visualization with the filtered data
    // You need to implement the logic to update the map and line graph with the filtered data here
  }

  onMount(async () => {
    const res = await fetch(`https://raw.githubusercontent.com/SeanIsayama/nysubways/main/src/data/MTA_01Feb2024_ridership.csv`);
    const text = await res.text();
    data = d3.csvParse(text);
    updateTopStations(busyness);
  });

  function updateTopStations(selectedHour) {
    const filteredData = data.filter(entry => {
        const timestamp = new Date(entry.transit_timestamp);
        const hour = timestamp.getHours();
        return hour === selectedHour;
    }).sort((a, b) => b.ridership - a.ridership).slice(0, 3);
    
    topStations = filteredData.map(d => ({
      station_complex: d.station_complex,
      ridership: d.ridership
    }));
  }

  // Call fetchData when the component mounts to fetch initial data
  onMount(() => {
    fetchData(busyness);
    // updateTopStations(index);
  });
  ///////////////////////////




  let geoJsonToFit = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [1, 0],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 1],
        },
      },
    ],
  };
  ///////////////////////////
  $: busyness, updateTopStations(busyness); // Reactive statement to update top stations when index changes
  ///////////////////////////

  $: projection = geoMercator().fitSize([width, height], geoJsonToFit);

        // Function to convert hour value to AM/PM format
        function hourToAmPm(hour) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            return formattedHour + ' ' + period;
        }


</script>


<Scroller
  top={0.0}
  bottom={1}
  threshold={0.5}

  bind:count
  bind:index
  bind:offset
  bind:progress
>
  
  <div class="background"
   slot="background"
   bind:clientWidth={width}
   bind:clientHeight={height}
   >
  </div>

    <div class="foreground" slot="foreground" >
      
      <div class="progress-bars">
        <p>current section: <strong>{index + 1}/{count}</strong></p>
        <progress value={count ? (index + 1) / count : 0} />
        <p>offset in current section: <strong>{parseFloat(offset).toFixed(2)}/1</strong></p>
        <progress value={offset || 0} />
    
        </div>
      <section style="height: 400px; background-color: #d9d9d9;">
        <div class="header"
        background-color= "#d9d9d9">
          <div class="header-content">
            <div class="section-text">
              <h1>A Deep Dive into MTA Data</h1>
              <h2>An interactive tool for New York City's subway system navigation</h2>
            </div>
          </div>
        </div>
      </section>
      <section style="height: 3600px;">
        <div class="fixed-graph">
      <h2>The Issue</h2>
          <Graph {index} {offset}/>
        </div>
      </section>
      <section>
        <h2>The Common Strategy</h2>
        <p>The most common strategy in which almost all tourists and commuters use to navitage subways efficiently is to identify when these subways are most/least populated. By doing to, people are able to avoid "rush" periods, and utilize the subway when it is less "rushed". The line plot below   depicts the number of riders per hour throughout a randomly chosen weekday. </p>
        <p style="font-size: 14px; font-style: italic;"> *For the plot below, we have depicted data for the day February 01, 2024, obtained from data.ny.gov</p>
        <Line/>
      </section>
      <section>section 3.</section>
      <section>
        <h2>Our Interactive Nagivation Tool</h2>
        <Map busyness={busyness} geoJsonToFit={geoJsonToFit} topStations={topStations} />

        <div class="hour-selector">
          <label for="hour-select" class="hour-label">Change hour here:</label>
          <select id="hour-select" bind:value={busyness} on:change={updateHour} class="hour-select">
            {#each hours as hour}
              <option value={hour}>{hour}:00 - {hour + 1}:00</option>
            {/each}
          </select>
        </div>

        <div class="menu-container">
          <div class="top-stations">
            <h2>Busiest stations at this time</h2>
            <ul>
              {#each topStations as station}
                <li>{station.station_complex}: {station.ridership} riders</li>
              {/each}
            </ul>
          </div>
        </div>
    
  </div>

</Scroller>

<style>
  .header {
  font-family: Nunito, sans-serif; 
  background-color: #d9d9d9;
  padding: 20px;
  border-bottom: 2px solid #ccc;
  }

  .header-content {
    background-color: "#d9d9d9";
    display: flex; /* Use flexbox layout */
    align-items: center; /* Center items vertically */
    justify-content: space-between; /* Separate text and image */
  }

  .section-text {
    flex: 1; /* Allow text to take up remaining space */
    margin-right: 20px; /* Add some space between text and image */
  }
  h1{
    font-size: 50px;
  }
  h2{
    font-size: 20px;
    font-family: Nunito, sans-serif;
  }
  text{
    font-size: 16px;
    font-family: Nunito, sans-serif;
  }
  .body {
  font-family: Nunito, sans-serif; 
  background-color: #f0f0f0;
  padding: 20px;
  border-bottom: 2px solid #ccc;
  }


  .header-image img {
    max-width: 40%; /* Ensure image doesn't exceed container width */
    float: right;
    height: auto; /* Maintain aspect ratio */
  }

  .current-time {
    font-family: Arial, sans-serif; /* Change the font family as desired */
    font-size: 16px; /* Adjust the font size */
    font-weight: bold; /* Adjust the font weight */
    color: #333; /* Adjust the font color */
  }
  .map {
    
    z-index: 2; /* Set a higher z-index for the map */
    /* Other styles */
  }
  .foreground {
    width: 100%;
    position: relative;
    background-color: #f0f0f0;
    /* padding-top: 500px;  */
    z-index: 0; 
    }

  .background {
    width: 100%;
    height: 100vh;
    position: relative;
    outline: rgb(255, 255, 255) solid 3px;
    z-index: 1;

  }
  section {
    height: 100vh;
    width: 91.5%;
    position: relative; /* Needed for absolute positioning of children */
    background-color: #f0f0f0;
    /* outline: black solid 3px;
    color: black; */
    padding-left: 60px;
    padding-right: 60px;
  }

  .stations-container {
  position: absolute;
  top: 500; /* Align with the top of the foreground */
  left: -60; /* Align with the left edge of the foreground */
  width: 100%; /* Take up the full width of the foreground */
  height: calc(100% - 500px); /* Take up the full height of the foreground */
  /* z-index: 10; Ensure it's above the sections */
  /* pointer-events: none; Allows clicks to pass through */
}

.station {
  position: absolute;
  width: 2px; /* Width of the vertical line */
  height: calc(100% - 500px); /* Adjust the height to start just below the hour labels */
  background-color: black; /* Color of the line */
  /* z-index: 5; Below the labels but above the sections */
}

.station-label {
  position: absolute;
  top: 0; /* Position at the top of the stations container */
  background-color: white; /* Background of the labels for readability */
  padding: 0 5px;
  /* z-index: 15; Above everything */
}

.station-line {
  position: absolute;
  top: 0; /* Start at the top of the stations container */
  bottom: 0; /* Stretch to the bottom of the stations container */
  background-color: black; /* Color of the line */
  /* z-index: 20; */
}
.progress-bars {
    position: fixed;
    top: 0px;
    right: 20px; /* Adjust the right positioning as needed */
    z-index: 999;
  }

  .fixed-graph {
    position: sticky;
    top: 50px; /* Adjust top positioning as needed */
    z-index: 999; /* Ensure the graph remains above other content */
  }
  .icon-large {
    font-size: 1000em; /* Adjust the size as needed */
}

.hour-selector {
  position: absolute;
  top: 25%;
  right: 10%; /* Adjust this value for the desired distance from the right edge */
  transform: translateY(-50%);
  z-index: 999; /* Ensure the dropdown is on top of other elements */
}
.hour-label {
  margin-bottom: 5px; /* Add some space between the label and the dropdown menu */
}
.top-stations {
  position: absolute;
  z-index: 9;
}
.top-stations ul {
  list-style-type: decimal; /* Use decimal numbers for list items */
}

.menu-container {
  position: absolute;
  top: 5%; /* Align with the top of the foreground */
  right: 0%; /* Align with the left edge of the foreground */
  width: 30%; /* Take up the full width of the foreground */
  height: 100%; /* Take up the full height of the foreground */
  border: 2px solid rgb(145, 144, 144); /* Initial border width */
  border-radius: 10px; /* Rounded border edges */
  transition: border-width 0.3s; /* Smooth transition for border width changes */
}





</style>
