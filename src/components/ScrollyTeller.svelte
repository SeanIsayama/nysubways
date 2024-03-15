<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import Scroller from "@sveltejs/svelte-scroller";
  import Map from "./Map.svelte";
  import Line from "./Line.svelte";
  import { geoMercator } from "d3-geo";
  import Bar from "./Bar.svelte";

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
    <!-- Removed the map content from here -->
    <!-- Removed the line and station content from here -->
    <div class="progress-bars">
      <p>current hour: <strong>{index + 1}/{count}</strong></p>
      <progress value={count ? (index + 1) / count : 0} />
    </div>

  </div>
  
  <div class="foreground" slot="foreground" >
    <!-- Moved the map component here -->
    <Map bind:geoJsonToFit {index} />
    <Line {index}/>

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

  .line-container {
    position: relative;
    z-index: 3; /* Ensure the line is above the map overlay */
  }

  .bar-container {
    position: relative;
    z-index: 2; /* Ensure the bar chart is above the line and map overlay */
  }
</style>
