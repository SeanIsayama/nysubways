<script>
  import * as d3 from 'd3';
  import mapboxgl from "mapbox-gl";
  import { onMount, afterUpdate } from "svelte";

  export let index;
  export let geoJsonToFit;
  export let topStations;

  mapboxgl.accessToken = "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";

  let container;
  let map;
  let zoomLevel;
  let stationsFile = "src/data/MTA_Subway_Hourly_Ridership__01Feb2024.csv";
  let station_markers;
  let stationData = [];
  let filteredStations = [];
  let data;

  function updateZoomLevel() {
    const screenWidth = window.innerWidth;
    zoomLevel = screenWidth <= 600 ? 4 : 10.5; // Adjust these values as needed
  }

  function handleResize() {
    updateZoomLevel();
    map.setZoom(zoomLevel);
  }

  onMount(() => {
    updateZoomLevel();
    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.886, 40.7128],
      zoom: zoomLevel,
      attributionControl: true, // removes attribution from the bottom of the map
    });
    map.on("load", () => {
      map.addSource("new_york_routes", {
        type: "geojson",
        data: "src/data/subwaylines.geojson",
      });
      map.addControl(new mapboxgl.NavigationControl());
      map.addLayer({
        id: "new_york_routes",
        type: "line",
        source: "new_york_routes",
        paint: {
          "line-color": [
            "match", 
            ["get", "rt_symbol"],
            "G", "#BEE5B0",
            "N", "#ADD8E6",
            "B", "#FFB6C1",
            "L", "#FFFFE0",
            "A", "#E6E6FA",
            "7", "#FFE4B5",
            "J", "#D3D3D3",
            "1", "#E6E6FA",
            "4", "#FFDAB9",
            "#000000" // Default color if the rt_symbol doesn't match any of the above
          ],
          "line-width": 3,
        },
      });
    });

    window.addEventListener("resize", handleResize);

    map.on("load", () => {
      updateBounds();
      map.on("zoom", updateBounds);
      map.on("drag", updateBounds);
      map.on("move", updateBounds);
    });

    fetch(stationsFile)
      .then(response => response.text())
      .then(text => {
        let csvData = d3.csvParse(text);
        data = csvData.map(d => ({
          ...d,
          radius: calculateRadius(d.ridership)
        }));
        createStationMarkers();
      });
  });

  afterUpdate(() => {
    update_station_markers();
  });

  function createStationMarkers() {
    const marker_container = d3
      .select(map.getCanvasContainer())
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("position", "absolute")
      .style("z-index", 1);

    station_markers = marker_container
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 0)
      .style("fill", "#808080")
      .attr("stroke", "#808080")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4);
    positionStationMarkers();
  }

  function positionStationMarkers() {
    station_markers
      .attr("cx", function(d) {
        return project(d).x;
      })
      .attr("cy", function(d) {
        return project(d).y;
      });
  }

  function updateBounds() {
    positionStationMarkers();
  }

  function calculateRadius(ridership) {
    const scale = d3.scaleLinear()
      .domain([0, 1, 500])
      .range([0, 2, 5]);
    return scale(ridership);
  }

  $: updatedRadius = calculateRadius(stationData[index]?.ridership || 0);
  const colorArrival = d3.scaleLinear()
    .domain([0, 11223]) // Assuming 11223 is the max ridership
    .range(["cyan", "purple"]);

  function update_station_markers() {
    station_markers
        .transition()
        .duration(1000)
        .attr("r", function(d) {
            const hour = new Date(d.transit_timestamp).getHours();
            return hour === index ? calculateRadius(d.ridership) : 0;
        })
        .style("fill", function(d) {
            const stationName = d.station_complex; // Assuming station_complex holds the station name
            console.log("Station name:", stationName);
            console.log("Top stations:", topStations);
            // Check if the station is in the top stations list
            const isTopStation = topStations.some(station => station.station_complex === stationName);
            console.log("Is top station?", isTopStation);
            // Return different colors based on whether it's in the top stations list
            return isTopStation ? "red" : colorArrival(d.ridership);
        });
}


  function project(d) {
    return map.project(new mapboxgl.LngLat(d.longitude, d.latitude));
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"
  />
</svelte:head>

<div class="map" bind:this={container} />

<style>
  .map {
    width: 50%;
    height: 100vh;
    position: absolute;
    outline: rgb(255, 255, 255) solid 3px;
  }
  .station-popup {
    position: absolute;
    background-color: white;
    border: 1px solid black;
    padding: 5px;
    font-size: 12px;
    z-index: 10;
  }
  svg {
    position: absolute;
    z-index: 1; 
  }
  .top-station {
    fill: red; /* Adjust the color for the highlighted stations */
    fill-opacity: 0.7; /* Adjust the opacity as needed */
    stroke: black; /* Adjust the border color */
    stroke-width: 1; /* Adjust the border width */
  }
</style>
