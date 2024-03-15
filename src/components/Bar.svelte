<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    export let index; // Index coming from ScrollyTeller to filter data for the current hour
  
    let svg;
    let xScale, yScale;
    let width = 500; // Set width to your preference
    let height = 500; // Set height to your preference
    let margin = { top: 20, right: 30, bottom: 40, left: 90 };
    let ridershipData; // This will hold the data once it's loaded
  
  
    // Define a function to draw the bar chart, called once the data is loaded and when index changes
    function drawBarGraph() {
      // Clear the existing graph
      svg.selectAll('*').remove();
      
      // Filter data for the current hour index
      const hourData = ridershipData.filter(d => {
        const hour = new Date(d.transit_timestamp).getHours();
        return hour === index;
      });
  
      // Define xScale based on the station names
      xScale = d3.scaleBand()
        .domain(hourData.map(d => d.station_complex))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      // Define yScale based on the ridership values
      yScale = d3.scaleLinear()
        .domain([0, d3.max(hourData, d => d.ridership)])
        .range([height - margin.bottom, margin.top]);
  
      // Draw bars using hourData
      svg.selectAll("rect")
        .data(hourData)
        .join("rect")
        .attr("x", d => xScale(d.station_complex))
        .attr("y", d => yScale(d.ridership))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.ridership))
        .attr("fill", "steelblue");
  
      // Draw x-axis
      svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
  
      // Draw y-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));
    }
  
    onMount(async () => {
      svg = d3.select('svg');
      const response = await fetch('src/data/MTA_Subway_Hourly_Ridership__Beginning_February_2022_20240308.csv');
      const csvText = await response.text();
      ridershipData = d3.csvParse(csvText, d3.autoType);
      drawBarGraph();
    });
  
    // React to changes in index to update the bar graph
    $: if (ridershipData && index !== undefined) {
      drawBarGraph();
    }
  </script>
  
  <div class="bar-container" bind:clientWidth={width} bind:clientHeight={height}>
      <svg bind:this={svg} width="100%" height="100%" viewBox="0 0 500 500">
          <!-- SVG content here -->
        </svg>
    </div>
  
  
  
<style>
    /* Styles for the bar chart */
    
    /* Styling for the container */
    .bar-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* Styling for the SVG */
    svg {
        width: 100%;
        height: 100%;
    }

    /* Styling for the bars */
    rect {
        fill: steelblue; /* Color of the bars */
    }

    /* Styling for the x-axis */
    .x-axis text {
        font-size: 10px; /* Font size of the x-axis labels */
    }

    /* Styling for the y-axis */
    .y-axis text {
        font-size: 10px; /* Font size of the y-axis labels */
    }

    /* Styling for axis lines */
    .axis path,
    .axis line {
        stroke: #ccc; /* Color of the axis lines */
    }
</style>
