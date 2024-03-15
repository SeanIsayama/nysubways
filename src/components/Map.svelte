<script>
  import * as d3 from 'd3';
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";

  export let index;
  export let geoJsonToFit;

  mapboxgl.accessToken = "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";

  let container;
  let map;
  let zoomLevel;
  let stationsFile = "https://raw.githubusercontent.com/SeanIsayama/nysubways/main/src/data/MTA_Subway_Hourly_Ridership__01Feb2024.csv";
  let station_markers;
  // let stationsFile = "/src/data/MTA_Subway_Hourly_Ridership__01Feb2024.csv";
  // let stationsFile = "https://data.ny.gov/resource/wujg-7c2s.json?$query=SELECT%0A%20%20%60transit_timestamp%60%2C%0A%20%20%60transit_mode%60%2C%0A%20%20%60station_complex_id%60%2C%0A%20%20%60station_complex%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60payment_method%60%2C%0A%20%20%60fare_class_category%60%2C%0A%20%20%60ridership%60%2C%0A%20%20%60transfers%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60georeference%60%2C%0A%20%20%60%3A%40computed_region_kjdx_g34t%60%2C%0A%20%20%60%3A%40computed_region_yamh_8v7k%60%2C%0A%20%20%60%3A%40computed_region_wbg7_3whc%60%0AWHERE%0A%20%20%60transit_timestamp%60%0A%20%20%20%20BETWEEN%20%222024-02-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20AND%20%222024-02-01T23%3A45%3A00%22%20%3A%3A%20floating_timestamp%0AORDER%20BY%20%60transit_timestamp%60%20ASC%20NULL%20LAST";
  // let station_data = [];

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
      data: "https://raw.githubusercontent.com/SeanIsayama/nysubways/main/src/data/subwaylines.geojson",
    })
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
        let data = d3.csvParse(text);
        createStationMarkers(data);
      });
  });

  function createStationMarkers(data) {
  const marker_container = d3
    .select(map.getCanvasContainer())
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("position", "absolute")
    .style("z-index", 2);

    station_markers = marker_container
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", function(d) {
        return calculateRadius(d.ridership);
      })
      .style("fill", "#808080")
      .attr("stroke", "#808080")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4)
      .on("mouseenter", function(event, d) {
        // Show popup with station name
        const popup = new mapboxgl.Popup({
          closeButton: false,
          offset: 25,
        })
          .setLngLat([d.longitude, d.latitude])
          .setHTML(`<p>${d.station_complex}</p>`)
          .addTo(map);
        this._popup = popup;
      })
      .on("mouseleave", function() {
        // Remove popup when mouse leaves
        if (this._popup) {
          this._popup.remove();
          this._popup = null;
        }
      });

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

  function project(d) {
    return map.project(new mapboxgl.LngLat(d.longitude, d.latitude));
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
</style>
