<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import Scroller from "@sveltejs/svelte-scroller";
  import Map from "./Map.svelte";
  import Line from "./Line.svelte";
  import { geoMercator } from "d3-geo";
  import Graph from "./Graph.svelte";

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();



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

  $: busyness, updateTopStations(busyness); // Reactive statement to update top stations when index changes


  $: projection = geoMercator().fitSize([width, height], geoJsonToFit);

        // Function to convert hour value to AM/PM format
        function hourToAmPm(hour) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            return formattedHour + ' ' + period;
        }

let selectedStation = null;
let ratio = null;
let mapCenter = [-73.886, 40.7128];

// Function to handle station click event
function handleStationClicked(event) {
  // Access the station data from the event detail
  const stationData = event.detail.detail;
  // Set the selected station for display purposes if needed
  selectedStation = stationData;
  ratio = Math.min(selectedStation.ridership / 14000, 1);
}

const colors = ['#44ce1b', '#bbdb44', '#f7e379', '#f2a134', '#e51f1f'];

function getStrokeColor(ratio) {
  // Calculate the index of the color based on the ratio
  const index = Math.floor(ratio * (colors.length - 1));
  return colors[index];
}



// Function to handle changes in the typed station name
let typedStationName = '';
let matchedStation = null;
let filteredStations = [];
let stationSelected = true;

function handleStationNameInput(event) {
      stationSelected = true;
      // Update filtered stations based on the typed station name
      filteredStations = data.filter(entry => {
        const entryTimestamp = new Date(entry.transit_timestamp);
        const entryHour = parseInt(d3.timeFormat('%H')(entryTimestamp));
        return entry.station_complex.toLowerCase().includes(typedStationName.toLowerCase()) && entryHour === busyness;
      });
      
    }

function handleKeyDown(event) {
  if (filteredStations.length === 1){
    if (event.key === 'Enter') {
      stationSelected = false;
      selectedStation = filteredStations[0];
      ratio = Math.min(selectedStation.ridership / 14000, 1);
      typedStationName = selectedStation.station_complex;
      dispatch('fly-station', selectedStation);

      handleZoomChange(selectedStation)

    }
  }
}
// Function to select a station from the autocomplete options
function selectStation(station) {
  stationSelected = false;
  selectedStation = station;
  ratio = Math.min(selectedStation.ridership / 14000, 1);
  typedStationName = selectedStation.station_complex;

  handleZoomChange(selectedStation)
}

let mapComponent;
function handleZoomChange(data) {
  mapComponent.changeZoom(data);
  }
function reset_zoom(){
  mapComponent.reset_zoom();
}
function zoom_manhattan(){
  mapComponent.zoom_manhattan();
  
}
function zoom_brookelyn(){
  mapComponent.zoom_brookelyn();
}
function zoom_bronx(){
  mapComponent.zoom_bronx();
}
function zoom_queens(){
  mapComponent.zoom_queens();
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
      
      <!-- <div class="progress-bars">
        <p>current section: <strong>{index + 1}/{count}</strong></p>
        <progress value={count ? (index + 1) / count : 0} />
        <p>offset in current section: <strong>{parseFloat(offset).toFixed(2)}/1</strong></p>
        <progress value={offset || 0} />
    
        </div> -->
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
      <section style="height: 830px;">
        <h2>Our Interactive Nagivation Tool</h2>
        <Map busyness={busyness} geoJsonToFit={geoJsonToFit} topStations={topStations} on:stationClick={handleStationClicked} bind:this={mapComponent}/>

        <div class="menu-container">
          <div class="top-stations">
            <h2>Busiest stations at this time</h2>
            <ul>
              {#each topStations as station}
                <li>{station.station_complex}: {station.ridership} riders</li>
              {/each}
            </ul>
          </div>

          <div class="hour-selector">
            <label for="hour-select" class="hour-label">change hour:</label>
            <select id="hour-select" bind:value={busyness} on:change={updateHour} class="hour-select">
              {#each hours as hour}
                <option value={hour}>{hour}:00 - {hour + 1}:00</option>
              {/each}
            </select>
          </div>
          <h1>Selected Station Details</h1>
          <div class="search-bar">
            <div class="search-text"> search for station:</div>
          <div class = "textbox">
            <input type="text" bind:value={typedStationName} placeholder="Type station_complex name" on:input={handleStationNameInput} on:keydown={handleKeyDown}>
              {#if stationSelected && typedStationName !== ""}
              <ul class="autocomplete-options">
                {#each filteredStations.slice(0, 8) as station}
                <div class="autocomplete-option" on:click={() => selectStation(station)}>{station.station_complex}</div>
                {/each}
              </ul>
              {/if}
          </div>
        </div>
        <div class="button-text"> jump to:</div>

        <svg width="100%" height="600"></svg>

        <div class="button-container">
          <button on:click={reset_zoom}>Reset</button>
          <button on:click={zoom_manhattan}>Manhattan</button>
          <button on:click={zoom_brookelyn}>Brooklyn</button>
          <button on:click={zoom_bronx}>Bronx</button>
          <button on:click={zoom_queens}>Queens</button>
        </div>
          
          {#if selectedStation}
          <!-- Display details of the selected station if needed -->
          <div class="station-name">
            <h2>station name</h2>
            <h3>{selectedStation.station_complex} Station</h3>
          </div>
          <div class="rider-count">
            <h2>number of riders</h2>
            <h3>{selectedStation.ridership} riders</h3>
          </div>
            <div class="donut-chart">
            {#if ratio !== null}
              <svg viewBox="-20 0 130 160" width="250" height="300">
                <!-- Rounded border with rectangular edges -->
                <rect x="5" y="5" width="100" height="140" rx="10" ry="10" fill="#f4f4ec" stroke="#ccc" stroke-width="1" />
                <!-- White circle background -->
                <circle cx="55" cy="90" r="40" fill="#ffffff"></circle>
                <!-- Donut chart -->
                <circle
                  cx="10"
                  cy="55"
                  r="40"
                  fill="transparent"
                  stroke={getStrokeColor(ratio)}
                  stroke-width="10"
                  stroke-dasharray={`${ratio * 251}, 251`}
                  transform="rotate(-90) translate(-100)"
                  style="transition: stroke-dasharray 0.5s ease, stroke 0.5s ease;"
                ></circle>
                <!-- Text -->
                <text
                x="50"
                y="23" 
                font-size="9"
                fill="#808080"
                font-style="italic"
                font-family= "Nunito, sans-serif"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                percent busyness
              </text>
                <text
                  x="55"
                  y="90"
                  font-size="15"
                  font-family= "Nunito, sans-serif"
                  text-anchor="middle"
                  dominant-baseline="middle"
                >
                  {(ratio * 100).toFixed(0)}%
                </text>
              </svg>
            {/if}
            <!-- Add more details as needed -->
          </div>
        {:else}
          <!-- Add text at the center when selectedStation is not available -->
          <div class="centered-text">
            <h2>click on a station to view details</h2>
          </div>
        {/if}

      
    
  </div>

</Scroller>

<style>
  .header {
  font-family: "Nunito", sans-serif; 
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
  h3{
    font-size: 18px;
    font-family: Nunito, sans-serif;
  }
  h4{
    font-weight: normal;
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
    margin: 0; /* Remove margin */
    border: none;
    }

  .background {
    width: 100%;
    height: 100vh;
    position: relative;
    outline: none;
    margin: 0; /* Remove margin */
    border: none;
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
  font-style: italic;
  font-family: "Nunito", sans-serif;
  position: absolute;
  top: 25%; /* Adjust this value according to your needs */
  right: 55%; /* Adjust this value for the desired distance from the right edge */
  transform: translateY(-50%);
  z-index: 999; /* Ensure the dropdown is on top of other elements */
}
.hour-label {
  margin-bottom: 5px; /* Add some space between the label and the dropdown menu */
}
.top-stations {
  font-family: "Nunito", sans-serif;
  right: 50%;
  transform: translateX(50%);
  width: 75%;
  top: 1%;
  border: 2px solid #ccc; /* Border color */
  border-radius: 10px; /* Adjust the value to change the roundness of corners */
  position: absolute;
  z-index: 9;
}
.top-stations h2 {
  text-align: center;
  margin-bottom: 10px; /* Optional: Add space below the heading */
}

.top-stations ul {
  list-style-type: decimal; /* Use decimal numbers for list items */
}
.top-stations li{
  font-family: "Nunito", sans-serif;
}

.menu-container {
  position: absolute;
  top: 5%; /* Align with the top of the foreground */
  right: 0%; /* Align with the left edge of the foreground */
  width: 30%; /* Take up the full width of the foreground */
  height: 94%; /* Take up the full height of the foreground */
  border: 2px solid rgb(145, 144, 144); /* Initial border width */
  border-radius: 10px; /* Rounded border edges */
  transition: border-width 0.3s; /* Smooth transition for border width changes */
}
.menu-container h1 {
  text-align: center;
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  margin-top: 220px; /* Adjust this value to move the text further down */
}
.station-name {
  height: 14%;
  width: 88%;
  right: 3%;
  position: absolute;
  z-index: 9;
  top: 43%;
  padding: 10px; /* Add padding to create some space between text and border */
  border: 2px solid #ccc; /* Set border width and color */
  border-radius: 10px; /* Set border radius to create rounded edges */
  background-color: #f4f4ec;
}
.station-name h2 {
  font-size: 15px;
  color: #808080;
  font-style: italic;
  font-weight: 530;
  font-family: "Nunito", sans-serif;
}
.station-name h3 {
  margin-top: -5px;
  font-size: 28px;
  color: black;
  font-weight: bold;
  font-family: "Nunito", sans-serif;
}
.rider-count {
  height: 15%;
  width: 42%;
  right: 3%;
  position: absolute;
  z-index: 9;
  top: 61%;
  padding: 10px; /* Add padding to create some space between text and border */
  border: 2px solid #ccc; /* Set border width and color */
  border-radius: 10px; /* Set border radius to create rounded edges */
  background-color: #f4f4ec;
}
.rider-count h2 {
  font-size: 15px;
  color: #808080;
  font-style: italic;
  font-weight: 530;
  font-family: "Nunito", sans-serif;
}
.rider-count h3 {
  margin-top: -5px;
  font-size: 25px;
  color: black;
  font-weight: bold;
  font-family: "Nunito", sans-serif;
}

.donut-chart {
  right: 50%;
  position: absolute;
  z-index: 9;
  top: 60%
}

.centered-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 100%);
}
.centered-text h2{
  font-size: 15px;
  color: #808080;
  font-style: italic;
  font-weight: normal;
  font-family: "Nunito", sans-serif;
}
.autocomplete-options {
  margin-top: 0px;
  position: absolute;
  background-color: #e7e7e7; /* Set background color */
  border: 1px solid #ccc; /* Add border for better visibility */
  z-index: 9999999; /* Ensure the options appear above other elements */
}
.autocomplete-option {
  padding: 1px; /* Add padding to the option for better spacing */
  cursor: pointer; /* Change cursor to pointer on hover */
}

.autocomplete-option:hover {
  background-color: #ccc; /* Change background color on hover */
}
.textbox {
  position: absolute;
  top: 32%; /* Adjust the top positioning as needed */
  right: 12%; /* Adjust the right positioning as needed */
}
.search-text {
  font-style: italic;
  font-family: "Nunito", sans-serif;
  margin-right: 10px; /* Adjust spacing between text and input field */
  transform: translateY(-70%);
}
.search-bar {
  font-style: italic;
  font-family: "Nunito", sans-serif;
  position: absolute;
  top: 25%; /* Adjust this value according to your needs */
  right: 0%; /* Adjust this value for the desired distance from the right edge */
  transform: translateY(-50%);
  z-index: 999; /* Ensure the dropdown is on top of other elements */
}
.button-text {
  font-style: italic;
  font-family: "Nunito", sans-serif;
  margin-right: 10px; /* Adjust spacing between text and input field */
  transform: translateX(10px);
}
.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    top: 270px;
    position: absolute;
    
  }
  .button-container button {
    margin: 0 5px; /* Adjust margin between buttons */
    padding: 5px 10px; /* Adjust button padding */
    font-size: 14px; /* Adjust button font size */
    border: 2px solid rgb(145, 144, 144); /* Initial border width */
    border-radius: 10px; /* Rounded border edges */
  }
  .button-container button:hover {
  background-color: #ccc; /* Change background color on hover */
}


</style>
