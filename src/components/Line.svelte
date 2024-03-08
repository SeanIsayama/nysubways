<script>
    // Import D3 library
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { scaleLinear, scaleUtc, extent } from 'd3';
  
    // Data
    let gx;
    let gy;
    let x, y;
    let lines = [];

    let data = [];

    onMount(async () => {
    const res = await fetch(
        '../../src/data/ridership_by_hour.csv',
    );
    const csv = await res.text();
    await d3.csvParse(csv, (d, i, columns) => {
        data.push({
            date: new Date(d[columns[1]]),
            value: +d[columns[2]],
        });
    });
    data = data;    
    });
    $: console.log(data)


    $: x = scaleUtc()
        .domain(extent(data, d => d.date))
        .range([marginLeft, width - marginRight]);

    $: y = scaleLinear()
        .domain(extent(data, d => d.value))
        .range([height - marginBottom, marginTop]);
    
    // Generate lines
    $: lines = data.map((d, i, arr) => {
        if (i === 0) return null; // Skip the first point
        return {
            x1: x(arr[i - 1].date),
            y1: y(arr[i - 1].value),
            x2: x(d.date),
            y2: y(d.value)
        };
        }).filter(d => d !== null); // Remove null values
    
    $: max = d3.max(data, (d) => Math.abs(d.value));

    // Create a symmetric diverging color scale.
    $: color = d3
    .scaleSequential()
    .domain([max, -max])
    .interpolator(d3.interpolateRdBu);

    // Define custom tick labels
    const customLabelsX = ['1 am', '4 am', '7 am', '10 am', '1 pm', '4 pm', '7 pm', '10 pm'];

    $: d3.select(gx)
        .call(d3.axisBottom(x)
        .ticks(8)
        .tickFormat((d, i) => customLabelsX[i]));

    const customLabelsY = ['50', '100', '150', '200', '250'];

    $: d3.select(gy)
        .call(d3.axisLeft(y)
            .ticks(4)
            .tickFormat((d, i) => customLabelsY[i]));


  
    // Margins and dimensions for the chart
    const marginTop = 20;
    const marginRight = 50;
    const marginBottom = 20;
    const marginLeft = 80;
    const width = 500; // Width of the chart
    const height = 200; // Height of the chart

  </script>
  
  <style>
    .chart {
      position: absolute;
      top: 100px;
      right: 100px;
      width: 500px;
      height: 250px;
      border: 1px solid #ccc;
    }
  
    .line {
      fill: none;
      stroke: steelblue;
      stroke-width: 2;
    }
    
  </style>
  
  <div class="chart">
    <svg width={width} height={height + 50}>
      <!-- x-axis -->
      <g bind:this={gx} transform="translate(0,{height - marginBottom})" />
      <!-- y-axis -->
      <g bind:this={gy} transform="translate({marginLeft},0)" />
      <!-- axis-labels -->
      <g transform="translate({width / 2}, {height - marginBottom / 2 + 30})">
        <text
            fill="#000"
            text-anchor="middle"
        >
            time of day
        </text>
        </g>
      <!-- Y Axis Label -->
      <g transform="translate({marginLeft / 2}, {height / 2}) rotate(-90)">
        <text
            fill="#000"
            text-anchor="middle"
        >
            riders per hour (thousands)
        </text>
        </g>
      <!-- Draw line chart -->
      <g stroke="#000" stroke-opacity="0.2">
        {#each lines as line, i}
                    <line
                        key={i}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        class="line"
                    />
                {/each}
        {#each data as d, i}
          <circle
            key={i}
            cx={x(d.date)}
            cy={y(d.value)}
            r="2"
          />
        {/each}
      </g>
  
    </svg>
  </div>