<script>
  import { onMount } from 'svelte';
  import { select } from 'd3-selection';
  import { scaleLinear } from 'd3-scale';
  import { transition } from 'd3-transition';
  export let index;
  export let offset;
  let data = Array.from({ length: 800 }, (_, i) => i); // Generate data for 800 circles
  const lines = [
  "The bustling metropolis of New York, often dubbed the 'City that ",
  "never sleeps,' is home to around 8 million residents as of 2024.", 
  "Navigating this vibrant city can be daunting for both locals and",
  "visitors alike with its sprawling streets and constant hustle. ",
  "Public transportation, particularly the iconic subway system, serves ",
  "as the lifeblood of New York, offering an essential means of getting",
  "around efficiently amidst the urban chaos."
];

  let text;

  // TRANSITION 1: Add circles
  function createCircles() {
    const svg = select('svg');
    
    // Remove existing circles
    svg.selectAll('circle').remove();

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (_, i) => i % 39 * 20 + 10) // Adjust x position based on the number of columns
      .attr('cy', (_, i) => Math.floor(i / 39) * 20 + 10) // Adjust y position based on the number of columns
      .attr('r', 0) // Set initial radius to 0 for fading in effect
      // .attr('fill', 'blue')
      .attr('fill', (_, i) => (offset > 0.3) ? (i < data.length / 2 ? 'red' : 'blue') : 'blue')
      .attr('opacity', 0) // Set initial opacity to 0 for fading in effect
      .transition() // Apply transition for fading in effect
      .duration(500) // Duration of the transition
      .delay((_, i) => i * 5) // Delay each circle's appearance for a smooth animation
      .attr('r', 5) // Animate radius
      .attr('opacity', 0.7); // Animate opacity

      // single circle for legend
      svg.append('circle')
        .attr('id', 'legend') // Add an ID to the legend circle
        .attr('cx', 850)
        .attr('cy', 20)
        .attr('fill', 'blue')
        .attr('opacity', 0) // Set initial opacity to 0 for fading in effect
        .transition() // Apply transition for fading in effect
        .duration(500) // Duration of the transition
        .delay((_, i) => i * 5) // Delay each circle's appearance for a smooth animation
        .attr('r', 5) // Animate radius
        .attr('opacity', 0.7); // Animate opacity


      text = svg.append('text')
        .attr('x', 850) // Adjust x position as needed
        .attr('y', 50) // Adjust y position as needed
        .attr('fill', 'black')
        .style('opacity', 0);

      text.selectAll('tspan')
      .data(lines.filter((_, i) => i <= 7))
      .enter()
      .append('tspan')
        .attr('x', 850)
        .attr('dy', (d, i) => i === 0 ? 0 : '1.2em') // Adjust line spacing as needed
        .text(d => d);
        
      text.append('tspan')
        .attr('x', 860)
        .attr('y', 25)
        .text(' = 10,000 people')
        .style('font-style', 'italic');

      text.transition()
        .duration(1000) // Adjust the duration as needed
        .style('opacity', 1); // Change opacity to 1 for fade-in effect
      
  }
  // TRANSITION 2: Update circles
  function updateColor(color) {
    select('svg').selectAll('circle')
      .filter((_, i) => i < 250)
      .transition() // Apply transition for color change
      .duration(500) // Duration of the transition
      .attr('fill', color);

    text.append('tspan')
          .attr('x', 850)
          .attr('y', 200) // Move down 20 units for the third line
          .text('Of all people who commuted to work in New York City in 2021,');
    text.append('tspan')
          .attr('x', 850)
          .attr('y', 220) // Move down 20 units for the third line
          .text(' 32% use the subway, demonstrating its vital role in the daily');
    text.append('tspan')
          .attr('x', 850)
          .attr('y', 240) // Move down 20 units for the third line
          .text("lives of New Yorkers. That's nearly 2.5 million commuters");
    text.append('tspan')
          .attr('x', 850)
          .attr('y', 260) // Move down 20 units for the third line
          .text("relying on the NYC subway network, showcasing its immense");
    text.append('tspan')
          .attr('x', 850)
          .attr('y', 280) // Move down 20 units for the third line
          .text("importance in keeping the city moving.");
          
    text.selectAll('tspan')
      .filter((_, i) => i >= 8)
      .style('opacity', 0) // Set initial opacity to 0 for fading in effect
      .transition() // Apply transition for fading in effect
      .duration(1000) // Duration of the transition
      .style('opacity', 1); // Change opacity to 1 for fade-in effect
  
  }

  // TRANSITION 3: Remove circles + add trains
  function addTrains() {
    select('svg').selectAll('circle')
      .filter((_, i) => i >= 250 && i != 800) // Selecting the first 400 circles
      .transition() // Apply transition for fading away
      .duration(500) // Duration of the transition
      .attr('opacity', 0) // Set opacity to 0 for fading away
      .remove(); // Remove the circles from the SVG

      const svg = select('svg');

      // Remove existing rectangles
      svg.selectAll('rect').remove();

      setTimeout(() => {
      // Append rectangles
      svg.selectAll('rect')
        .data(Array.from({ length: 64 }, (_, i) => i))
        .enter()
        .append('rect')
        .attr('id', 'to-move')
        .attr('x', -100) // Start position outside the left side of the SVG
        .attr('y', (_, i) => Math.floor(i / 13) * 40 + 150) // Adjust y position based on the number of rows
        .attr('width', 40) // Set width of rectangles
        .attr('height', 20) // Set height of rectangles
        .attr('fill', 'none') // Set fill color of rectangle to none (transparent)
        .attr('stroke', 'black') // Set outline color to black
        .transition() // Apply transition for animating in
        .duration(1000) // Duration of the transition
        .attr('x', (_, i) => i % 13 * 60)
        .on('end', function() {
          // Move circles inside the rectangles
          svg.selectAll('circle:not(#legend)')
            .transition() // Apply transition for moving circles
            .duration(1000) // Duration of the transition
            .attr('id', function(_, i) {
              let conditionalOffset = 0; // Initialize conditional offset
              // Check conditions and adjust the conditional offset accordingly
              if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 0 && i <= 190) {
                  conditionalOffset = 230; // If conditions are met, set the conditional offset to 300
              } else if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 1 && i <= 160) {
                  conditionalOffset = 130; // If conditions are met, set the conditional offset to 100
              }
              // Based on the conditions, return the id 'to-move' or null
              return conditionalOffset !== 0 ? 'to-move' : null;
          })
            .attr('cy', (_, i) => {
              let basePosition = Math.floor(i / 39) * 20 + 10; // Base vertical position calculation
              let conditionalOffset = 0; // Initialize conditional offset

              // Check conditions and adjust the conditional offset accordingly
              if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 0 && i <= 190) {
                  conditionalOffset = 230; // If conditions are met, set the conditional offset to 300
              
              } else if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 1 && i <= 160) {
                  conditionalOffset = 130; // If conditions are met, set the conditional offset to 100
              }

              // Combine the base position and conditional offset to get the final vertical position
              return basePosition + conditionalOffset;
            })
          });
          // single rect for legend
          svg.append('rect')
            .attr('id', 'legend') // Add an ID to the legend circle
            .attr('width', 40) // Set width of rectangles
            .attr('height', 20) // Set height of rectangles
            .attr('fill', 'none') // Set fill color of rectangle to none (transparent)
            .attr('stroke', 'black') // Set outline color to black
            .attr('x', 850)
            .attr('y', 295)
            .attr('opacity', 0) // Set initial opacity to 0 for fading in effect
            .transition() // Apply transition for fading in effect
            .duration(500) // Duration of the transition
            .attr('opacity', 0.7); // Animate opacity
          }, 500);
      //for rect legend
      text.append('tspan')
        .attr('x', 890)
        .attr('y', 310)
        .text(' = 100 subway cars')
        .style('font-style', 'italic');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 340) // Move down 20 units for the third line
        .text('On the other hand, there are only around 6400 subways cars,');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 360) // Move down 20 units for the third line
        .text('acccording to the MTA. These cars fit an average of 200');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 380) // Move down 20 units for the third line
        .text('people, meaning the system can only handle a fraction');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 400) // Move down 20 units for the third line
        .text("of NYC's bustling commuter population, even at full capacity.");

      text.selectAll('tspan')
        .filter((_, i) => i >= 13)
        .style('opacity', 0) // Set initial opacity to 0 for fading in effect
        .transition() // Apply transition for fading in effect
        .duration(1000) // Duration of the transition
        .style('opacity', 1); // Change opacity to 1 for fade-in effect
    }
    // TRANSITION 4: Move circles and rectangles left and out of the screen
    function moveLeftAndOut() {
        const svg = select('svg');

        // Move circles left and out of the screen
        svg.selectAll('#to-move')
            .transition() // Apply transition for moving elements
            .duration(1000) // Duration of the transition
            .attr('cx', -200)
            .attr('x', -200); // Move elements outside the left side of the screen
    }
    // TRANSITION 5: Add green circles animated coming from below
    function addGreenCircles() {
        const svg = select('svg');

        // Append green circles
        svg.selectAll('.green-circle')
            .data(Array.from({ length: 100 })) // Data for 100 circles
            .enter()
            .append('circle')
            .attr('class', 'green-circle')
            .attr('cx', (_, i) => Math.random() * 800) // Random x position within the SVG width
            .attr('cy', 600) // Starting position below the SVG
            .attr('r', 0) // Initial radius set to 0
            .attr('fill', 'green') // Fill color set to green
            .transition() // Apply transition for animation
            .duration(1000) // Duration of the transition
            .delay((_, i) => i * 10) // Delay each circle's appearance for a smooth animation
            .attr('r', 5) // Animate radius
            .attr('cy', (_, i) => 500 - Math.random() * 100); // Random y position within a range
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 440) // Move down 20 units for the third line
        .text('Aside from the millions of locals, New York City welcomes');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 460) // Move down 20 units for the third line
        .text('an astounding 56.7 million visitors annually as of 2022. For ');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 480) // Move down 20 units for the third line
        .text("tourists, navigating the city's subway system can be a daunting task");
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 500) // Move down 20 units for the third line
        .text('especially during peak times when trains are crowded with regular');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 520) // Move down 20 units for the third line
        .text("commuters. Avoiding rushes and finding your way amidst the subway's");
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 540) // Move down 20 units for the third line
        .text('labyrinthine routes can seem like an insurmountable challenge for ');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 560) // Move down 20 units for the third line
        .text('newcomers. However, with the right tools and strategies, exploring ');
      text.append('tspan')
        .attr('x', 850)
        .attr('y', 580) // Move down 20 units for the third line
        .text(" New York's subway can become an adventure in itself.");

      text.append('tspan')
        .attr('x', 400)
        .attr('y', 550) // Move down 20 units for the third line
        .style('font-family', 'Nunito, sans-serif')
        .text('Influx of tourists');
      
      text.append('tspan')
        .attr('x', 100)
        .attr('y', 170) // Move down 20 units for the third line
        .style('font-family', 'Nunito, sans-serif')
        .text('Leftover residents');

      text.selectAll('tspan')
        .filter((_, i) => i >= 18)
        .style('opacity', 0) // Set initial opacity to 0 for fading in effect
        .transition() // Apply transition for fading in effect
        .duration(1000) // Duration of the transition
        .style('opacity', 1); // Change opacity to 1 for fade-in effect
    }
      // TRANSITION 4: Move circles and rectangles left and out of the screen
      function finalQuestion() {
        const svg = select('svg');
        // Move circles left and out of the screen
        text.append('tspan')
          .attr('x', 30)
          .attr('y', 270)
          .style('font-family', 'Nunito, sans-serif')
          .style('font-weight', 'bold')
          .style('font-size', '24px')
          .text('So, what is the most optimal way to navigate the NYC subway?');

        text.selectAll('tspan')
          .filter((_, i) => i >= 28)
          .style('opacity', 0) // Set initial opacity to 0 for fading in effect
          .transition() // Apply transition for fading in effect
          .duration(1000) // Duration of the transition
          .style('opacity', 1); // Change opacity to 1 for fade-in effect
      }
  let circleMade = false;
  $: if (index === 1 && offset > 0.15 && !circleMade) {
            createCircles();
            circleMade = true;
        } 
  
  let circleUpdate = false;
  $: if (index === 1 && offset > 0.3 && !circleUpdate) {
            updateColor("red")
            circleUpdate = true;
        } 
  let addTrain = false;
  $: if (index === 1 && offset > 0.4 && !addTrain) {
            addTrains()
            addTrain = true;
        } 
  let updateTriggered = false;
  $: {
      if (index === 1 && offset > 0.55 && !updateTriggered) {
          moveLeftAndOut();
          updateTriggered = true;
      }
    }
  let addGreenTriggered = false;
  $: {
      if (index === 1 && offset > 0.65 && !addGreenTriggered) {
          addGreenCircles();
          addGreenTriggered = true;
      }
  }
  let questionAsked = false;
  $: {
      if (index === 1 && offset > 0.8 && !questionAsked) {
        finalQuestion();
          questionAsked = true;
      }
  }
</script>

<svg width="100%" height="600"></svg>

<style>
  svg {
    background-color: #f0f0f0;
    position: "absolute";
    font-size: 16px;
  }
</style>
