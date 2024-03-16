<svelte:head>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"
  />
</svelte:head>

<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import Scroller from "@sveltejs/svelte-scroller";
  import Map from "./Map.svelte";
  import Line from "./Line.svelte";
  import { geoMercator } from "d3-geo";
  import Bar from "./Bar.svelte";

  let count, offset, progress;
  let width, height;

  let index = 0;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function updateHour() {
    fetchData(index);
  }

  async function fetchData(index) {
    const res = await fetch(`src/data/ridership_by_hour.csv`);
    const text = await res.text();
    const data = d3.csvParse(text);
    const filteredData = data.filter(entry => {
        // Extract the hour from the transit_timestamp
        const timestamp = new Date(entry.transit_timestamp);
        const hour = timestamp.getHours();
        // Compare the extracted hour with the selected hour
        return hour === index;
    });
    // Update the visualization with the filtered data
    // You need to implement the logic to update the map and line graph with the filtered data here
  }

  // Call fetchData when the component mounts to fetch initial data
  onMount(() => {
    fetchData(index);
  });

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

  $: projection = geoMercator().fitSize([width, height], geoJsonToFit);

</script>

<div class="hour-selector">
  <label for="hour-select" class="hour-label">Change hour here:</label>
  <select id="hour-select" bind:value={index} on:change={updateHour} class="hour-select">
    {#each hours as hour}
      <option value={hour}>{hour}:00 - {hour + 1}:00</option>
    {/each}
  </select>
</div>

<Scroller
  top={0.0}
  bottom={1}
  threshold={0.5}
  bind:count
  bind:index
  bind:offset
  bind:progress
>
  <div class="background" slot="background" bind:clientWidth={width} bind:clientHeight={height}>
  </div>
  
  <div class="foreground" slot="foreground">
    <Map geoJsonToFit={geoJsonToFit} />
    <div class="charts-container">
        <!-- <Bar {index}/> -->
        <Line {index} />
      <div class="bar-container">
        <!-- <Bar {index}/> -->
      </div>
      <div class="ridership-info"></div>

    </div>

  </div>
</Scroller>

<style>
  .background {
    width: 100%;
    height: 100vh;
    position: relative;
    outline: rgb(255, 255, 255) solid 3px;
  }

  .foreground {
    width: 100%;
    height: 100vh;
    position: relative;
    outline: rgb(255, 255, 255) solid 3px;
  }

  .progress-bars {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999; /* Adjust the z-index value as needed */
  }

  .map-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1; /* Ensure the map is below the bar chart */
  }

  .charts-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .line-container {
    flex: 1; /* Take up remaining space */
    position: relative;
    z-index: 3; /* Ensure the line is above the map overlay */
  }

  .bar-container {
    flex: 1; /* Take up remaining space */
    position: relative;
    z-index: 1; /* Ensure the bar chart is above the line and map overlay */
  }
  .ridership-info {
    width: 500px; /* Adjust the value for desired width */
    height: 500px; /* Adjust the value for desired height */
    position: absolute; /* Make the element positioned relative to its parent */
    bottom: 10px;  /* Set the bottom position from the bottom edge */
    right: 10px;  /* Set the right position from the right edge  */
    outline: 1px solid red; /* This line will outline the element */
    /* You can adjust the values (10px) for bottom and right to fine-tune placement */
}
.hour-selector {
  position: absolute;
  top: 30%;
  right: 350px; /* Adjust this value for the desired distance from the right edge */
  transform: translateY(-50%);
  z-index: 999; /* Ensure the dropdown is on top of other elements */
}
.hour-label {
  margin-bottom: 5px; /* Add some space between the label and the dropdown menu */
}
</style>
