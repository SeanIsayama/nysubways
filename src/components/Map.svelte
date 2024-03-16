<script>
  import * as d3 from 'd3';
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  export let busyness;
  export let geoJsonToFit;
  export let topStations;


  mapboxgl.accessToken =
    "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";

  let container;
  let map;
  let zoomLevel;
  // let stationsFile = "https://raw.githubusercontent.com/SeanIsayama/nysubways/main/src/data/MTA_Subway_Hourly_Ridership__01Feb2024.csv"
  let stationsFile = `src/data/MTA_01Feb2024_ridership.csv`
  // let stationsFile = "https://data.ny.gov/resource/wujg-7c2s.json?$query=SELECT%0A%20%20%60transit_timestamp%60%2C%0A%20%20%60transit_mode%60%2C%0A%20%20%60station_complex_id%60%2C%0A%20%20%60station_complex%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60payment_method%60%2C%0A%20%20%60fare_class_category%60%2C%0A%20%20%60ridership%60%2C%0A%20%20%60transfers%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60georeference%60%2C%0A%20%20%60%3A%40computed_region_kjdx_g34t%60%2C%0A%20%20%60%3A%40computed_region_yamh_8v7k%60%2C%0A%20%20%60%3A%40computed_region_wbg7_3whc%60%0AWHERE%0A%20%20%60transit_timestamp%60%0A%20%20%20%20BETWEEN%20%222024-02-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20AND%20%222024-02-01T23%3A45%3A00%22%20%3A%3A%20floating_timestamp%0AORDER%20BY%20%60transit_timestamp%60%20ASC%20NULL%20LAST";
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
      data: "https://raw.githubusercontent.com/SeanIsayama/nysubways_test/main/src/data/subwaylines.geojson",
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
      });
			// .attr("name", function (d) {
			// 	return d["name"];
			// });
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

      // const filteredData = station_data.filter(row => {
      //       const timestamp = new Date(row.transit_timestamp);
      //       const targetHour = d3.timeFormat('%H')(timestamp);
      //       return targetHour == index;
      //   });
      
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
          .range([0, 2, 5]); // Define the range of circle radii based on your preference
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

</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"
  />
</svelte:head>

<div class="map" class:visible={isVisible} bind:this={container} />

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

