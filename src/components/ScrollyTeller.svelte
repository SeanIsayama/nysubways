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
    <Map bind:geoJsonToFit {index} />
    <Line {index}/>
    <!-- <Graph {index} {width} {height} {projection} /> -->
    <div class="progress-bars">
      <p>current hour: <strong>{index + 1}/{count}</strong></p>
      <progress value={count ? (index + 1) / count : 0} />
    </div>

  </div>
  
  <div class="foreground" slot="foreground">
    <div class="stations-container">
      {#each ['Station 1', 'Station 2', 'Station 3'] as station, i}
        <div class="station" style="left: {i * 33}%;">
          <span class="station-label">{station}</span>
          <div class="station-line"></div>
        </div>
      {/each}
    </div>
  
    {#each Array(24) as _, i}
      <section>
        <span class="hour-label">{i === 0 ? '12 AM' : (i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`)}</span>
      </section>
    {/each}
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
  width: 10%;
  position: relative;
  left: 100%;
  padding-top: 500px; /* Space on top */
  }

  section {
    position: relative; /* Needed for absolute positioning of children */
    height: 20vh; /* Adjust to fit more sections */
    background-color: white; /* Boxes to white */
    outline: black solid 3px;
    color: black;
    padding-left: 60px; /* Provide space for the hour label */
    margin: 0 0 0 em 0;
    border-left: 3px solid black; /* Black line for sections */
  }

  .hour-label {
    position: absolute;
    left: -60px; /* Adjust based on padding-left of section */
    top: 0%;
    transform: translateY(-50%); /* Center vertically */
    padding: 0 10px; /* Padding for the label */
  }

  .stations-container {
  position: absolute;
  top: 500; /* Align with the top of the foreground */
  left: -60; /* Align with the left edge of the foreground */
  width: 100%; /* Take up the full width of the foreground */
  height: calc(100%-500px); /* Take up the full height of the foreground */
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
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999; /* Adjust the z-index value as needed */
  }


</style>
