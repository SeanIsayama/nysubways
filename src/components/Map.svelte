<script>
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  export let index;
  export let geoJsonToFit;

  mapboxgl.accessToken =
    "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";

  let container;
  let map;
  
  let zoomLevel;

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
			data: "/src/data/subwaylines.geojson",
		});
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
  });

  function updateBounds() {
    const bounds = map.getBounds();
    geoJsonToFit.features[0].geometry.coordinates = [
      bounds._ne.lng,
      bounds._ne.lat,
    ];
    geoJsonToFit.features[1].geometry.coordinates = [
      bounds._sw.lng,
      bounds._sw.lat,
    ];
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
    width: 100%;
    height: 100vh; /* check problem when setting width */
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: opacity 2s, visibility 2s;
    outline: blue solid 3px;
  }

  .map.visible {
    opacity: 1;
    visibility: visible;
  }
</style>

