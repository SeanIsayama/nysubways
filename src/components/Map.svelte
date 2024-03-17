<script>
  import * as d3 from 'd3';
  import ScrollyTeller from "./ScrollyTeller.svelte";
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  import { createEventDispatcher } from 'svelte';
  export let busyness;
  export let geoJsonToFit;
  export let topStations;

  const dispatch = createEventDispatcher();


  mapboxgl.accessToken =
    "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";

  let container;
  let map;
  let zoomLevel;
  let stationsFile = "https://raw.githubusercontent.com/SeanIsayama/nysubways/main/src/data/MTA_01Feb2024_ridership.csv"
  // let stationsFile = `src/data/MTA_01Feb2024_ridership.csv`
	// let station_data = [];
	let station_markers;

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
      attributionControl: true, 
      scrollZoom: false,
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

    function hideLabelLayers() {
      const labelLayerIds = map
        .getStyle()
        .layers.filter(
          (layer) =>
            layer.type === "symbol" && /label|text|place/.test(layer.id)
        )
        .map((layer) => layer.id);

      for (const layerId of labelLayerIds) {
        map.setLayoutProperty(layerId, "visibility", "none");
      }
    }

    map.on("load", () => {
      hideLabelLayers();
      updateBounds();
      map.on("zoom", updateBounds);
      map.on("drag", updateBounds);
      map.on("move", updateBounds);
      
    });
    /////////////////
    // fetch(stationsFile)
		// .then((response) => response.json())
		// .then((d) => (station_data = d))
    // .then((d) => create_station_markers(d));
    /////////////////
    fetch(stationsFile)
    .then(response => response.text())
    .then(text => {
        // Parse the CSV data
        let data = d3.csvParse(text);
        // Further processing or manipulation of the data as needed
        create_station_markers(data);
    });

    const marker_container = d3
		.select(map.getCanvasContainer() )
		.append("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		.style("position", "absolute")
		.style("z-index", 2);

    function create_station_markers(data) {
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
      })
      // Click event listener for station markers
      .on("click", function(event, d) {
        // Dispatch custom event with station data
        dispatch('stationClick', { detail: d });
        
        const newZoom = 13; // Choose an appropriate zoom level
        const newCenter = [d.longitude, d.latitude];

        // Animate the map zooming into the selected station
        map.flyTo({
          center: newCenter,
          zoom: newZoom,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });


      });
      position_station_markers();
    }
  function position_station_markers() {
		station_markers
			.attr("cx", function (d) {
				return project(d).x;
			})
			.attr("cy", function (d) {
				return project(d).y;
			});
	}


  });
  function project(d) {
		return map.project(new mapboxgl.LngLat(d.longitude, d.latitude));
	}
  // $: console.log(station_markers.data)
  $: {
      if (busyness !== 'undefined' && station_markers) {
        update_station_markers();
      }
    }
  // Set gradient color scheme
  const color_arrival = d3.scaleLinear()
		.range(["cyan", "purple"]);
  function update_station_markers() {
      
		station_markers
    .transition()
		.duration(1000)
    .attr("r", function(d) {
        if (busyness == d3.timeFormat('%H')(new Date(d.transit_timestamp))) {

          return calculateRadius(d.ridership);
        } else {
          return 0
        }
        })
        .style("fill", function (d) {
                return color_arrival(d.ridership/3000) //max is 11223
            });

	}
  function calculateRadius(ridership) {
      // Define your scale here
      const scale = d3.scaleLinear()
          .domain([0, 1, 500]) // Define your domain based on the expected range of ridership values
          .range([0, 3, 6]); // Define the range of circle radii based on your preference
      return scale(ridership);
    }

  function updateBounds() {
    const bounds = map.getBounds();
    if (busyness !== 'undefined' && station_markers) {
		station_markers
			.attr("cx", function (d) {
        if (project(d).x !== 'undefined'){
          return project(d).x;
        }
				
			})
			.attr("cy", function (d) {
        if (project(d).y !== 'undefined'){
          return project(d).y;
        }
			});
    }
  }
  let isVisible = true;

  // $: if (index === 2) {
  //   isVisible = true;
  // } else {
  //   isVisible = false;
  // }

  export function changeZoom(d) {
    const newZoom = 13; // Choose an appropriate zoom level
        const newCenter = [d.longitude, d.latitude];

       // Animate the map zooming into the selected station
       map.flyTo({
         center: newCenter,
         zoom: newZoom,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
  }

</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"
  />
</svelte:head>

<div class="map" class:visible={isVisible} bind:this={container}></div>


<style>
  .map {
    left: -50px;
    width: 75%;
    height: 100vh; /* check problem when setting width */
    position: relative;
    opacity: 0;
    visibility: hidden;
    transition: opacity 2s, visibility 2s;
  }

  .map.visible {
    opacity: 1;
    visibility: visible;
  }
</style>

