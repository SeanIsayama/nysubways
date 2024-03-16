<script>
    // Import D3 library
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { scaleLinear, scaleUtc, extent } from 'd3';
    export let index = 0;

  
    // Data
    let gx;
    let gy;
    let x, y;
    let lines = [];
    let data = [];




    onMount(async () => {
    const res = await fetch(
        'src/data/ridership_by_hour.csv',
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
            y2: y(d.value),
            color: customColor(d.date)
        };
        }).filter(d => d !== null); // Remove null values
    
    $: max = d3.max(data, (d) => Math.abs(d.value));

    // Define custom tick labels
    const customLabelsX = ['1 am', '4 am', '7 am', '10 am', '1 pm', '4 pm', '7 pm', '10 pm'];

    $: d3.select(gx)
        .call(d3.axisBottom(x)
        .ticks(8)
        .tickFormat((d, i) => customLabelsX[i]));

    const customLabelsY = ['100', '200', '300', '400'];

    $: d3.select(gy)
        .call(d3.axisLeft(y)
            .ticks(4)
            .tickFormat((d, i) => customLabelsY[i])
            );


  
    // Margins and dimensions for the chart
    const marginTop = 20;
    const marginRight = 50;
    const marginBottom = 20;
    const marginLeft = 80;
    const width = 500; // Width of the chart
    const height = 200; // Height of the chart

    // Custom color function
    const customColor = (d) => {
        // $: console.log(d >= Date.UTC(2024, 2, 1, 17 ))
        // $: console.log(d3.timeFormat('%H')(d))
        // $: console.log(hour > 12)
        const hour = d3.timeFormat('%H')(d)

        if (hour >= 20) {
            return 'orange';
        } else if (hour >= 15) {
            return 'red';
        } else if (hour >= 11) {
            return 'purple';
        } else if (hour >= 6) {
            return 'blue';
        } else {
            return 'green';
        }
    };


  </script>
  
  <style>
    .line-container {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%; /* Adjust width as needed */
        height: 100vh;
    }

    .chart {
        position: relative;
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
    }
    
  </style>
  
  <div class="line-container">
    <div class="chart">
        <svg width={width} height={height + 50}>
            <!-- x-axis -->
            <g bind:this={gx} transform="translate(0,{height - marginBottom})" />
            <!-- y-axis -->
            <g bind:this={gy} transform="translate({marginLeft},0)" />
            <!-- axis-labels -->
            <g transform="translate({width / 2}, {height - marginBottom / 2 + 30})">
                <text
                    font-size="12px"
                    font-family="Nunito, sans-serif" 
                    fill="#000"
                    text-anchor="middle"
                >
                    time of day
                </text>
            </g>
            <!-- Y Axis Label -->
            <g transform="translate({marginLeft / 2}, {height / 2}) rotate(-90)">
                <text
                    font-size="12px"
                    font-family="Nunito, sans-serif" 
                    fill="#000"
                    text-anchor="middle"
                >
                    riders per hour (thousands)
                </text>
            </g>
            <!-- Text Labels -->
            <text 
                font-family="Nunito, sans-serif" 
                font-size="10px"
                x={width / 4 - 10} 
                y={height/2 + 70}
                text-anchor="middle" 
            >
                early morning
            </text>
            <text 
                font-family="Nunito, sans-serif" 
                font-size="10px"
                x={width / 2 - 10} 
                y={height/8 + 15}
                text-anchor="middle" 
            >
                a.m. peak
            </text>
            <text 
                font-family="Nunito, sans-serif" 
                font-size="10px"
                x={width / 2 + 20} 
                y={height/2 + 40}
                text-anchor="middle" 
            >
                midday
            </text>
            <text 
                font-family="Nunito, sans-serif" 
                font-size="10px"
                x={width - 110} 
                y={height/8 + 15}
                text-anchor="middle" 
            >
                p.m. peak
            </text>
            <text 
                font-family="Nunito, sans-serif" 
                font-size="10px"
                x={width - 50} 
                y={height/2 + 40}
                text-anchor="middle" 
            >
                evening
            </text>
            <!-- Draw line chart -->
            <g stroke="#000" stroke-opacity="0.5">
                {#if typeof index !== 'undefined' && data[index]}
                
                {#each lines as line, i}
                    <line
                        key={i}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        class="line"
                        style="stroke: {line.color}; stroke-width: 3;"
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
                <!-- Dynamic vertical line -->
                <line
                    x1={data[index] ? x(data[index].date) : 0}
                    y1={marginTop}
                    x2={data[index] ? x(data[index].date) : 0}
                    y2={height - marginBottom}
                    stroke="#FF0000"
                    stroke-width="2"
                />
                <text 
                    font-family="Nunito, sans-serif" 
                    font-size="12px"
                    x={data[index] ? x(data[index].date) : 0}
                    y={marginTop - 8}
                >
                    <tspan>
                        {data[index].value} riders
                    </tspan>
                    <tspan 
                        x={data[index] ? x(data[index].date) : 0} dy="1.2em"
                        font-size="9px"
                    >
                        {d3.timeFormat('%I:%M %p')(data[index].date)}
                    </tspan>
                </text>
                {/if}
            </g>
        </svg>
    </div>
</div>
