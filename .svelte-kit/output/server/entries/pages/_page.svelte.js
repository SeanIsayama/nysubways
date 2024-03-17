import { c as create_ssr_component, d as add_attribute, e as escape, f as createEventDispatcher, v as validate_component, h as each } from "../../chunks/ssr.js";
import * as d3 from "d3";
import { scaleUtc, extent, scaleLinear } from "d3";
import mapboxgl from "mapbox-gl";
import "d3-transition";
import { geoMercator } from "d3-geo";
import { select } from "d3-selection";
const css$4 = {
  code: "svelte-scroller-outer.svelte-1yjh2jm{display:block;position:relative}svelte-scroller-background.svelte-1yjh2jm{display:block;position:relative;width:100%}svelte-scroller-foreground.svelte-1yjh2jm{display:block;position:relative;z-index:2}svelte-scroller-foreground.svelte-1yjh2jm::after{content:' ';display:block;clear:both}svelte-scroller-background-container.svelte-1yjh2jm{display:block;position:absolute;width:100%;max-width:100%;pointer-events:none;will-change:transform}",
  map: null
};
const handlers = [];
if (typeof window !== "undefined") {
  const run_all = () => handlers.forEach((fn) => fn());
  window.addEventListener("scroll", run_all);
  window.addEventListener("resize", run_all);
}
if (typeof IntersectionObserver !== "undefined") {
  const map = /* @__PURE__ */ new Map();
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const update = map.get(entry.target);
        const index = handlers.indexOf(update);
        if (entry.isIntersecting) {
          if (index === -1)
            handlers.push(update);
        } else {
          update();
          if (index !== -1)
            handlers.splice(index, 1);
        }
      });
    },
    {
      rootMargin: "400px 0px"
      // TODO why 400?
    }
  );
}
const Scroller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let style;
  let widthStyle;
  let { top = 0 } = $$props;
  let { bottom = 1 } = $$props;
  let { threshold = 0.5 } = $$props;
  let { query = "section" } = $$props;
  let { parallax = false } = $$props;
  let { index = 0 } = $$props;
  let { count = 0 } = $$props;
  let { offset = 0 } = $$props;
  let { progress = 0 } = $$props;
  let { visible = false } = $$props;
  let outer;
  let foreground;
  let background;
  let offset_top = 0;
  if ($$props.top === void 0 && $$bindings.top && top !== void 0)
    $$bindings.top(top);
  if ($$props.bottom === void 0 && $$bindings.bottom && bottom !== void 0)
    $$bindings.bottom(bottom);
  if ($$props.threshold === void 0 && $$bindings.threshold && threshold !== void 0)
    $$bindings.threshold(threshold);
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.parallax === void 0 && $$bindings.parallax && parallax !== void 0)
    $$bindings.parallax(parallax);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.count === void 0 && $$bindings.count && count !== void 0)
    $$bindings.count(count);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  $$result.css.add(css$4);
  style = `
		position: ${"absolute"};
		top: 0;
		transform: translate(0, ${offset_top}px);
		z-index: ${1};
	`;
  widthStyle = "";
  return ` <svelte-scroller-outer class="svelte-1yjh2jm"${add_attribute("this", outer, 0)}><svelte-scroller-background-container class="background-container svelte-1yjh2jm" style="${escape(style, true) + escape(widthStyle, true)}"><svelte-scroller-background class="svelte-1yjh2jm"${add_attribute("this", background, 0)}>${slots.background ? slots.background({}) : ``}</svelte-scroller-background></svelte-scroller-background-container> <svelte-scroller-foreground class="svelte-1yjh2jm"${add_attribute("this", foreground, 0)}>${slots.foreground ? slots.foreground({}) : ``}</svelte-scroller-foreground> </svelte-scroller-outer>`;
});
const css$3 = {
  code: ".map.svelte-m4tv5e{left:-50px;width:75%;height:100vh;position:relative;opacity:0;visibility:hidden;-webkit-transition:opacity 2s, visibility 2s;transition:opacity 2s, visibility 2s}.map.visible.svelte-m4tv5e{opacity:1;visibility:visible}",
  map: null
};
const Map$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { busyness } = $$props;
  let { geoJsonToFit } = $$props;
  let { topStations } = $$props;
  createEventDispatcher();
  mapboxgl.accessToken = "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";
  let container;
  let map;
  let station_markers;
  const color_arrival = d3.scaleLinear().range(["cyan", "purple"]);
  function update_station_markers() {
    station_markers.transition().duration(1e3).attr("r", function(d) {
      if (busyness == d3.timeFormat("%H")(new Date(d.transit_timestamp))) {
        return calculateRadius(d.ridership);
      } else {
        return 0;
      }
    }).style("fill", function(d) {
      return color_arrival(d.ridership / 3e3);
    });
  }
  function calculateRadius(ridership) {
    const scale = d3.scaleLinear().domain([0, 1, 500]).range(
      [0, 3, 6]
    );
    return scale(ridership);
  }
  function changeZoom(d) {
    const newZoom = 13;
    const newCenter = [d.longitude, d.latitude];
    map.flyTo({
      center: newCenter,
      zoom: newZoom,
      essential: true
      // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  function reset_zoom() {
    const newZoom = 10.5;
    const newCenter = [-73.886, 40.7128];
    map.flyTo({
      center: newCenter,
      zoom: newZoom,
      essential: true
      // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  function zoom_manhattan() {
    const newZoom = 12;
    const newCenter = [-73.9712, 40.7128];
    map.flyTo({
      center: newCenter,
      zoom: newZoom,
      essential: true
      // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  function zoom_brookelyn() {
    const newZoom = 12;
    const newCenter = [-73.9442, 40.6782];
    map.flyTo({
      center: newCenter,
      zoom: newZoom,
      essential: true
      // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  function zoom_bronx() {
    const newZoom = 12;
    const newCenter = [-73.8648, 40.8448];
    map.flyTo({
      center: newCenter,
      zoom: newZoom,
      essential: true
      // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  function zoom_queens() {
    const newZoom = 12;
    const newCenter = [-73.7949, 40.7282];
    map.flyTo({
      center: newCenter,
      zoom: newZoom,
      essential: true
      // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  if ($$props.busyness === void 0 && $$bindings.busyness && busyness !== void 0)
    $$bindings.busyness(busyness);
  if ($$props.geoJsonToFit === void 0 && $$bindings.geoJsonToFit && geoJsonToFit !== void 0)
    $$bindings.geoJsonToFit(geoJsonToFit);
  if ($$props.topStations === void 0 && $$bindings.topStations && topStations !== void 0)
    $$bindings.topStations(topStations);
  if ($$props.changeZoom === void 0 && $$bindings.changeZoom && changeZoom !== void 0)
    $$bindings.changeZoom(changeZoom);
  if ($$props.reset_zoom === void 0 && $$bindings.reset_zoom && reset_zoom !== void 0)
    $$bindings.reset_zoom(reset_zoom);
  if ($$props.zoom_manhattan === void 0 && $$bindings.zoom_manhattan && zoom_manhattan !== void 0)
    $$bindings.zoom_manhattan(zoom_manhattan);
  if ($$props.zoom_brookelyn === void 0 && $$bindings.zoom_brookelyn && zoom_brookelyn !== void 0)
    $$bindings.zoom_brookelyn(zoom_brookelyn);
  if ($$props.zoom_bronx === void 0 && $$bindings.zoom_bronx && zoom_bronx !== void 0)
    $$bindings.zoom_bronx(zoom_bronx);
  if ($$props.zoom_queens === void 0 && $$bindings.zoom_queens && zoom_queens !== void 0)
    $$bindings.zoom_queens(zoom_queens);
  $$result.css.add(css$3);
  {
    {
      if (busyness !== "undefined" && station_markers) {
        update_station_markers();
      }
    }
  }
  return `${$$result.head += `<!-- HEAD_svelte-1s9kg0l_START --><link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"><!-- HEAD_svelte-1s9kg0l_END -->`, ""} <div class="${["map svelte-m4tv5e", "visible"].join(" ").trim()}"${add_attribute("this", container, 0)}></div>`;
});
const css$2 = {
  code: ".line.svelte-14rsg8u{fill:none;stroke:steelblue;stroke-width:2}",
  map: null
};
const marginTop = 20;
const marginRight = 50;
const marginBottom = 20;
const marginLeft = 100;
const width = 1300;
const height = 600;
const Line = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let gx;
  let gy;
  let x, y;
  let data = [];
  const customLabelsX = ["1 am", "4 am", "7 am", "10 am", "1 pm", "4 pm", "7 pm", "10 pm"];
  const customLabelsY = ["100", "200", "300", "400"];
  const customColor = (d) => {
    const hour = d3.timeFormat("%H")(d);
    if (hour >= 20) {
      return "orange";
    } else if (hour >= 15) {
      return "red";
    } else if (hour >= 11) {
      return "purple";
    } else if (hour >= 6) {
      return "blue";
    } else {
      return "green";
    }
  };
  $$result.css.add(css$2);
  x = scaleUtc().domain(extent(data, (d) => d.date)).range([marginLeft, width - marginRight]);
  y = scaleLinear().domain(extent(data, (d) => d.value)).range([height - marginBottom, marginTop]);
  data.map((d, i, arr) => {
    if (i === 0)
      return null;
    return {
      x1: x(arr[i - 1].date),
      y1: y(arr[i - 1].value),
      x2: x(d.date),
      y2: y(d.value),
      color: customColor(d.date)
    };
  }).filter((d) => d !== null);
  d3.max(data, (d) => Math.abs(d.value));
  {
    d3.select(gx).call(d3.axisBottom(x).ticks(8).tickFormat((d, i) => customLabelsX[i]));
  }
  {
    d3.select(gy).call(d3.axisLeft(y).ticks(4).tickFormat((d, i) => customLabelsY[i]));
  }
  return `<div class="chart"><svg${add_attribute("width", width, 0)}${add_attribute("height", height + 50, 0)}><g transform="${"translate(0," + escape(height - marginBottom, true) + ")"}"${add_attribute("this", gx, 0)}></g><g transform="${"translate(" + escape(marginLeft, true) + ",0)"}"${add_attribute("this", gy, 0)}></g><g transform="${"translate(" + escape(width / 2, true) + ", " + escape(height - marginBottom / 2 + 30, true) + ")"}"><text font-size="12px" font-family="Nunito, sans-serif" fill="#000" text-anchor="middle">time of day</text></g><g transform="${"translate(" + escape(marginLeft / 2, true) + ", " + escape(height / 2, true) + ") rotate(-90)"}"><text font-size="12px" font-family="Nunito, sans-serif" fill="#000" text-anchor="middle">riders per hour (thousands)</text></g><text font-family="Nunito, sans-serif" font-size="12px"${add_attribute("x", width / 4 - 100, 0)}${add_attribute("y", height / 2 + 250, 0)} text-anchor="middle">early morning
      </text><text font-family="Nunito, sans-serif" font-size="12px"${add_attribute("x", width / 2 - 100, 0)}${add_attribute("y", height / 8 + 15, 0)} text-anchor="middle">a.m. peak
      </text><text font-family="Nunito, sans-serif" font-size="12px"${add_attribute("x", width / 2 + 20, 0)}${add_attribute("y", height / 2 + 40, 0)} text-anchor="middle">midday
      </text><text font-family="Nunito, sans-serif" font-size="12px"${add_attribute("x", width - 270, 0)}${add_attribute("y", height / 8 + 15, 0)} text-anchor="middle">p.m. peak
      </text><text font-family="Nunito, sans-serif" font-size="12px"${add_attribute("x", width - 150, 0)}${add_attribute("y", height / 2 + 100, 0)} text-anchor="middle">evening
      </text><g stroke="#000" stroke-opacity="0.5">${``}</g></svg></div>`;
});
const css$1 = {
  code: 'svg.svelte-bssioj{background-color:#f0f0f0;position:"absolute";font-size:16px}',
  map: null
};
const Graph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index } = $$props;
  let { offset } = $$props;
  let data = Array.from({ length: 800 }, (_, i) => i);
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
  function createCircles() {
    const svg = select("svg");
    svg.selectAll("circle").remove();
    svg.selectAll("circle").data(data).enter().append("circle").attr("cx", (_, i) => i % 39 * 20 + 10).attr(
      "cy",
      (_, i) => Math.floor(i / 39) * 20 + 10
      // Adjust y position based on the number of columns
    ).attr("r", 0).attr(
      "fill",
      (_, i) => offset > 0.3 ? i < data.length / 2 ? "red" : "blue" : "blue"
    ).attr("opacity", 0).transition().duration(
      500
      // Apply transition for fading in effect // Duration of the transition
    ).delay((_, i) => i * 5).attr(
      "r",
      5
      // Animate radius
    ).attr("opacity", 0.7);
    svg.append("circle").attr("id", "legend").attr(
      "cx",
      850
    ).attr("cy", 20).attr("fill", "blue").attr("opacity", 0).transition().duration(
      500
      // Apply transition for fading in effect // Duration of the transition
    ).delay((_, i) => i * 5).attr(
      "r",
      5
      // Animate radius
    ).attr("opacity", 0.7);
    text = svg.append("text").attr("x", 850).attr(
      "y",
      50
      // Adjust y position as needed
    ).attr("fill", "black").style("opacity", 0);
    text.selectAll("tspan").data(lines.filter((_, i) => i <= 7)).enter().append("tspan").attr("x", 850).attr("dy", (d, i) => i === 0 ? 0 : "1.2em").text(
      (d) => d
    );
    text.append("tspan").attr("x", 860).attr("y", 25).text(" = 10,000 people").style("font-style", "italic");
    text.transition().duration(1e3).style(
      "opacity",
      1
    );
  }
  function updateColor(color) {
    select("svg").selectAll("circle").filter((_, i) => i < 250).transition().duration(
      500
      // Duration of the transition
    ).attr("fill", color);
    text.append("tspan").attr("x", 850).attr("y", 200).text(
      "Of all people who commuted to work in New York City in 2021,"
    );
    text.append("tspan").attr("x", 850).attr("y", 220).text(
      " 32% use the subway, demonstrating its vital role in the daily"
    );
    text.append("tspan").attr("x", 850).attr("y", 240).text(
      "lives of New Yorkers. That's nearly 2.5 million commuters"
    );
    text.append("tspan").attr("x", 850).attr("y", 260).text(
      "relying on the NYC subway network, showcasing its immense"
    );
    text.append("tspan").attr("x", 850).attr("y", 280).text(
      "importance in keeping the city moving."
    );
    text.selectAll("tspan").filter((_, i) => i >= 8).style("opacity", 0).transition().duration(
      1e3
      // Apply transition for fading in effect // Duration of the transition
    ).style("opacity", 1);
  }
  function addTrains() {
    select("svg").selectAll("circle").filter((_, i) => i >= 250 && i != 800).transition().duration(
      500
      // Apply transition for fading away // Duration of the transition
    ).attr("opacity", 0).remove();
    const svg = select("svg");
    svg.selectAll("rect").remove();
    setTimeout(
      () => {
        svg.selectAll("rect").data(Array.from({ length: 64 }, (_, i) => i)).enter().append("rect").attr("id", "to-move").attr("x", -100).attr(
          "y",
          (_, i) => Math.floor(i / 13) * 40 + 150
          // Adjust y position based on the number of rows
        ).attr("width", 40).attr(
          "height",
          20
          // Set height of rectangles
        ).attr("fill", "none").attr(
          "stroke",
          "black"
          // Set outline color to black
        ).transition().duration(
          1e3
          // Duration of the transition
        ).attr("x", (_, i) => i % 13 * 60).on("end", function() {
          svg.selectAll("circle:not(#legend)").transition().duration(
            1e3
            // Duration of the transition
          ).attr("id", function(_, i) {
            let conditionalOffset = 0;
            if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 0 && i <= 190) {
              conditionalOffset = 230;
            } else if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 1 && i <= 160) {
              conditionalOffset = 130;
            }
            return conditionalOffset !== 0 ? "to-move" : null;
          }).attr("cy", (_, i) => {
            let basePosition = Math.floor(i / 39) * 20 + 10;
            let conditionalOffset = 0;
            if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 0 && i <= 190) {
              conditionalOffset = 230;
            } else if (i % 3 !== 2 && Math.floor(i / 39) % 2 === 1 && i <= 160) {
              conditionalOffset = 130;
            }
            return basePosition + conditionalOffset;
          });
        });
        svg.append("rect").attr("id", "legend").attr(
          "width",
          40
          // Set width of rectangles
        ).attr("height", 20).attr(
          "fill",
          "none"
          // Set fill color of rectangle to none (transparent)
        ).attr("stroke", "black").attr(
          "x",
          850
        ).attr("y", 295).attr("opacity", 0).transition().duration(
          500
          // Apply transition for fading in effect // Duration of the transition
        ).attr("opacity", 0.7);
      },
      500
    );
    text.append("tspan").attr("x", 890).attr("y", 310).text(" = 100 subway cars").style("font-style", "italic");
    text.append("tspan").attr("x", 850).attr("y", 340).text(
      "On the other hand, thre are only around 6400 subways cars,"
    );
    text.append("tspan").attr("x", 850).attr("y", 360).text(
      "acccording to the MTA. These cars fit an average of 200"
    );
    text.append("tspan").attr("x", 850).attr("y", 380).text(
      "people, meaning the system can only handle a fraction"
    );
    text.append("tspan").attr("x", 850).attr("y", 400).text(
      "of NYC's bustling commuter population, even at full capacity."
    );
    text.selectAll("tspan").filter((_, i) => i >= 13).style("opacity", 0).transition().duration(
      1e3
      // Apply transition for fading in effect // Duration of the transition
    ).style("opacity", 1);
  }
  function moveLeftAndOut() {
    const svg = select("svg");
    svg.selectAll("#to-move").transition().duration(
      1e3
      // Duration of the transition
    ).attr("cx", -200).attr("x", -200);
  }
  function addGreenCircles() {
    const svg = select("svg");
    svg.selectAll(".green-circle").data(Array.from({ length: 100 })).enter().append(
      "circle"
    ).attr("class", "green-circle").attr("cx", (_, i) => Math.random() * 800).attr(
      "cy",
      600
      // Starting position below the SVG
    ).attr("r", 0).attr(
      "fill",
      "green"
      // Fill color set to green
    ).transition().duration(
      1e3
      // Duration of the transition
    ).delay((_, i) => i * 10).attr(
      "r",
      5
      // Animate radius
    ).attr("cy", (_, i) => 500 - Math.random() * 100);
    text.append("tspan").attr("x", 850).attr("y", 440).text(
      "Aside from the millions of locals, New York City welcomes"
    );
    text.append("tspan").attr("x", 850).attr("y", 460).text(
      "an astounding 56.7 million visitors annually as of 2022. For "
    );
    text.append("tspan").attr("x", 850).attr("y", 480).text(
      "tourists, navigating the city's subway system can be a daunting task"
    );
    text.append("tspan").attr("x", 850).attr("y", 500).text(
      "especially during peak times when trains are crowded with regular"
    );
    text.append("tspan").attr("x", 850).attr("y", 520).text(
      "commuters. Avoiding rushes and finding your way amidst the subway's"
    );
    text.append("tspan").attr("x", 850).attr("y", 540).text(
      "labyrinthine routes can seem like an insurmountable challenge for "
    );
    text.append("tspan").attr("x", 850).attr("y", 560).text(
      "newcomers. However, with the right tools and strategies, exploring "
    );
    text.append("tspan").attr("x", 850).attr("y", 580).text(
      " New York's subway can become an adventure in itself."
    );
    text.append("tspan").attr("x", 400).attr("y", 550).style(
      "font-family",
      "Nunito, sans-serif"
    ).text("Influx of tourists");
    text.append("tspan").attr("x", 100).attr("y", 170).style(
      "font-family",
      "Nunito, sans-serif"
    ).text("Leftover residents");
    text.selectAll("tspan").filter((_, i) => i >= 18).style("opacity", 0).transition().duration(
      1e3
      // Apply transition for fading in effect // Duration of the transition
    ).style("opacity", 1);
  }
  function finalQuestion() {
    select("svg");
    text.append("tspan").attr("x", 30).attr("y", 270).style("font-family", "Nunito, sans-serif").style("font-weight", "bold").style("font-size", "24px").text("So, what is the most optimal way to navigate the NYC subway?");
    text.selectAll("tspan").filter((_, i) => i >= 28).style("opacity", 0).transition().duration(
      1e3
      // Apply transition for fading in effect // Duration of the transition
    ).style("opacity", 1);
  }
  let circleMade = false;
  let circleUpdate = false;
  let addTrain = false;
  let updateTriggered = false;
  let addGreenTriggered = false;
  let questionAsked = false;
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  $$result.css.add(css$1);
  {
    if (index === 1 && offset > 0.15 && !circleMade) {
      createCircles();
      circleMade = true;
    }
  }
  {
    if (index === 1 && offset > 0.3 && !circleUpdate) {
      updateColor("red");
      circleUpdate = true;
    }
  }
  {
    if (index === 1 && offset > 0.4 && !addTrain) {
      addTrains();
      addTrain = true;
    }
  }
  {
    {
      if (index === 1 && offset > 0.55 && !updateTriggered) {
        moveLeftAndOut();
        updateTriggered = true;
      }
    }
  }
  {
    {
      if (index === 1 && offset > 0.65 && !addGreenTriggered) {
        addGreenCircles();
        addGreenTriggered = true;
      }
    }
  }
  {
    {
      if (index === 1 && offset > 0.8 && !questionAsked) {
        finalQuestion();
        questionAsked = true;
      }
    }
  }
  return `<svg width="100%" height="600" class="svelte-bssioj"></svg>`;
});
const css = {
  code: '.header.svelte-dpgcga.svelte-dpgcga{font-family:"Nunito", sans-serif;background-color:#d9d9d9;padding:20px;border-bottom:2px solid #ccc}.header-content.svelte-dpgcga.svelte-dpgcga{background-color:"#d9d9d9";display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between}.section-text.svelte-dpgcga.svelte-dpgcga{-webkit-box-flex:1;flex:1;margin-right:20px}h1.svelte-dpgcga.svelte-dpgcga{font-size:50px}h2.svelte-dpgcga.svelte-dpgcga{font-size:20px;font-family:Nunito, sans-serif}h3.svelte-dpgcga.svelte-dpgcga{font-size:18px;font-family:Nunito, sans-serif}h4.svelte-dpgcga.svelte-dpgcga{font-style:italic;font-weight:normal;font-size:12px;font-family:Nunito, sans-serif}.foreground.svelte-dpgcga.svelte-dpgcga{width:100%;position:relative;background-color:#f0f0f0;z-index:0;margin:0;border:none}.background.svelte-dpgcga.svelte-dpgcga{width:100%;height:100vh;position:relative;outline:none;margin:0;border:none;z-index:1}section.svelte-dpgcga.svelte-dpgcga{height:100vh;width:91.5%;position:relative;background-color:#f0f0f0;padding-left:60px;padding-right:60px}.fixed-graph.svelte-dpgcga.svelte-dpgcga{position:sticky;top:50px;z-index:999}.hour-selector.svelte-dpgcga.svelte-dpgcga{font-style:italic;font-family:"Nunito", sans-serif;position:absolute;top:25%;right:55%;-webkit-transform:translateY(-50%);transform:translateY(-50%);z-index:999}.hour-label.svelte-dpgcga.svelte-dpgcga{margin-bottom:5px}.top-stations.svelte-dpgcga.svelte-dpgcga{font-family:"Nunito", sans-serif;right:50%;-webkit-transform:translateX(50%);transform:translateX(50%);width:75%;top:1%;border:2px solid #ccc;border-radius:10px;position:absolute;z-index:9;background-color:#f4f4ec}.top-stations.svelte-dpgcga h2.svelte-dpgcga{text-align:center;margin-bottom:10px}.top-stations.svelte-dpgcga ul.svelte-dpgcga{list-style-type:decimal}.top-stations.svelte-dpgcga li.svelte-dpgcga{font-family:"Nunito", sans-serif}.menu-container.svelte-dpgcga.svelte-dpgcga{position:absolute;top:17%;right:0%;width:30%;height:82%;border:2px solid rgb(145, 144, 144);border-radius:10px;-webkit-transition:border-width 0.3s;transition:border-width 0.3s;background-color:#ecece6}.menu-container.svelte-dpgcga h1.svelte-dpgcga{text-align:center;font-family:"Nunito", sans-serif;font-size:20px;margin-top:220px}.station-name.svelte-dpgcga.svelte-dpgcga{height:14%;width:88%;right:3%;position:absolute;z-index:9;top:43%;padding:10px;border:2px solid #ccc;border-radius:10px;background-color:#f4f4ec}.station-name.svelte-dpgcga h2.svelte-dpgcga{font-size:15px;color:#808080;font-style:italic;font-weight:530;font-family:"Nunito", sans-serif}.station-name.svelte-dpgcga h3.svelte-dpgcga{margin-top:-5px;font-size:28px;color:black;font-weight:bold;font-family:"Nunito", sans-serif}.rider-count.svelte-dpgcga.svelte-dpgcga{height:15%;width:42%;right:3%;position:absolute;z-index:9;top:61%;padding:10px;border:2px solid #ccc;border-radius:10px;background-color:#f4f4ec}.rider-count.svelte-dpgcga h2.svelte-dpgcga{font-size:15px;color:#808080;font-style:italic;font-weight:530;font-family:"Nunito", sans-serif}.rider-count.svelte-dpgcga h3.svelte-dpgcga{margin-top:-5px;font-size:25px;color:black;font-weight:bold;font-family:"Nunito", sans-serif}.donut-chart.svelte-dpgcga.svelte-dpgcga{right:50%;position:absolute;z-index:9;top:60%\n}.centered-text.svelte-dpgcga.svelte-dpgcga{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%, 100%);transform:translate(-50%, 100%)}.centered-text.svelte-dpgcga h2.svelte-dpgcga{font-size:15px;color:#808080;font-style:italic;font-weight:normal;font-family:"Nunito", sans-serif}.autocomplete-options.svelte-dpgcga.svelte-dpgcga{margin-top:0px;position:absolute;background-color:#e7e7e7;border:1px solid #ccc;z-index:9999999}.autocomplete-option.svelte-dpgcga.svelte-dpgcga{padding:1px;cursor:pointer}.autocomplete-option.svelte-dpgcga.svelte-dpgcga:hover{background-color:#ccc}.textbox.svelte-dpgcga.svelte-dpgcga{position:absolute;top:32%;right:12%}.search-text.svelte-dpgcga.svelte-dpgcga{font-style:italic;font-family:"Nunito", sans-serif;margin-right:10px;-webkit-transform:translateY(-70%);transform:translateY(-70%)}.search-bar.svelte-dpgcga.svelte-dpgcga{font-style:italic;font-family:"Nunito", sans-serif;position:absolute;top:25%;right:0%;-webkit-transform:translateY(-50%);transform:translateY(-50%);z-index:999}.button-text.svelte-dpgcga.svelte-dpgcga{font-style:italic;font-family:"Nunito", sans-serif;margin-right:10px;-webkit-transform:translateX(10px);transform:translateX(10px)}.button-container.svelte-dpgcga.svelte-dpgcga{display:-webkit-box;display:flex;-webkit-box-pack:center;justify-content:center;margin-top:20px;top:270px;position:absolute}.button-container.svelte-dpgcga button.svelte-dpgcga{margin:0 5px;padding:5px 10px;font-size:14px;border:2px solid rgb(145, 144, 144);border-radius:10px;background-color:#f4f4ec}.button-container.svelte-dpgcga button.svelte-dpgcga:hover{background-color:#ccc}.lines-container.svelte-dpgcga.svelte-dpgcga{height:12%;width:42%;right:3%;position:absolute;z-index:9;top:80%;padding:10px;border:2px solid #ccc;border-radius:10px;background-color:#f4f4ec}.lines-container.svelte-dpgcga h2.svelte-dpgcga{font-size:15px;color:#808080;font-style:italic;font-weight:530;font-family:"Nunito", sans-serif}.lines-container.svelte-dpgcga h3.svelte-dpgcga{margin-top:-5px;font-size:25px;color:black;font-weight:bold;font-family:"Nunito", sans-serif}',
  map: null
};
const ScrollyTeller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let count, index, offset, progress;
  let width2, height2;
  let busyness = 0;
  let data = [];
  let topStations = [];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  function updateTopStations(selectedHour) {
    const filteredData = data.filter((entry) => {
      const timestamp = new Date(entry.transit_timestamp);
      const hour = timestamp.getHours();
      return hour === selectedHour;
    }).sort((a, b) => b.ridership - a.ridership).slice(0, 3);
    topStations = filteredData.map((d) => ({
      station_complex: d.station_complex,
      ridership: d.ridership
    }));
  }
  let geoJsonToFit = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [1, 0] }
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [0, 1] }
      }
    ]
  };
  let selectedStation = null;
  let ratio = null;
  const colors = ["#44ce1b", "#bbdb44", "#f7e379", "#f2a134", "#e51f1f"];
  function getStrokeColor(ratio2) {
    const index2 = Math.floor(ratio2 * (colors.length - 1));
    return colors[index2];
  }
  let typedStationName = "";
  let mapComponent;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      updateTopStations(busyness);
    }
    geoMercator().fitSize([width2, height2], geoJsonToFit);
    {
      {
        selectedStation = null;
        ratio = null;
      }
    }
    $$rendered = `${validate_component(Scroller, "Scroller").$$render(
      $$result,
      {
        top: 0,
        bottom: 1,
        threshold: 0.5,
        count,
        index,
        offset,
        progress
      },
      {
        count: ($$value) => {
          count = $$value;
          $$settled = false;
        },
        index: ($$value) => {
          index = $$value;
          $$settled = false;
        },
        offset: ($$value) => {
          offset = $$value;
          $$settled = false;
        },
        progress: ($$value) => {
          progress = $$value;
          $$settled = false;
        }
      },
      {
        foreground: () => {
          return `<div class="foreground svelte-dpgcga" slot="foreground"> <section style="height: 400px; background-color: #d9d9d9;" class="svelte-dpgcga" data-svelte-h="svelte-8kiua8"><div class="header svelte-dpgcga" background-color="#d9d9d9"><div class="header-content svelte-dpgcga"><div class="section-text svelte-dpgcga"><h1 class="svelte-dpgcga">A Deep Dive into MTA Data</h1> <h2 class="svelte-dpgcga">An interactive tool for New York City&#39;s subway system navigation</h2> <a href="https://youtu.be/N35HDHWHOQc">Old Demo Video</a></div></div></div> <h4 style="height: 120px; display: flex; justify-content: center; align-items: center;" class="svelte-dpgcga">Scroll slowly to begin</h4></section> <section style="height: 3600px;" class="svelte-dpgcga"><div class="fixed-graph svelte-dpgcga"><h2 class="svelte-dpgcga" data-svelte-h="svelte-73zzey">The Issue</h2> ${validate_component(Graph, "Graph").$$render($$result, { index, offset }, {}, {})}</div></section> <section class="svelte-dpgcga"><h2 class="svelte-dpgcga" data-svelte-h="svelte-kirs69">The Common Strategy</h2> <p data-svelte-h="svelte-ccyn5v">The most common strategy in which almost all tourists and commuters use to navitage subways efficiently is to identify when these subways are most/least populated. By doing to, people are able to avoid &quot;rush&quot; periods, and utilize the subway when it is less &quot;rushed&quot;. The line plot below depicts the number of riders per hour throughout a randomly chosen weekday. Hover over the graph to view the number of riders for a particular time.</p> <p style="font-size: 14px; font-style: italic;" data-svelte-h="svelte-p2qpz7">*For the plot below, we have depicted data for the day February 01, 2024, obtained from data.ny.gov</p> ${validate_component(Line, "Line").$$render($$result, {}, {}, {})}</section> <section style="height: 960px;" class="svelte-dpgcga"><h2 class="svelte-dpgcga" data-svelte-h="svelte-1nk6x48">Our Interactive Nagivation Tool</h2> <p data-svelte-h="svelte-1ay0ta1">However, while understanding peak hours is crucial, it&#39;s only part of the equation. What the previous strategy overlooks is the dynamic nature of subway traffic at individual stations and along specific lines throughout the day. Not all stations experience the same level of activity during peak hours, nor are they uniformly quiet during off-peak times. This realization led to the development of a revolutionary tool: the interactive ridership analysis map. By harnessing the power of data visualization, we&#39;re now equipped to delve deeper into the ebb and flow of subway activity. With this tool, we can explore the busiest and quietest stations at any given hour, empowering both locals and visitors to navigate the city with precision and confidence. Each circle on the map represents a unique subway station, its color and size reflecting the corresponding ridership statistics for that hour. Feel free to explore New York City&#39;s transportation network and use this tool to analyze ridership patterns at various hours to plan your commute.</p> ${validate_component(Map$1, "Map").$$render(
            $$result,
            {
              busyness,
              geoJsonToFit,
              topStations,
              this: mapComponent
            },
            {
              this: ($$value) => {
                mapComponent = $$value;
                $$settled = false;
              }
            },
            {}
          )} <div class="menu-container svelte-dpgcga"><div class="top-stations svelte-dpgcga"><h2 class="svelte-dpgcga" data-svelte-h="svelte-6g4uqy">Busiest stations at this time</h2> <ul class="svelte-dpgcga">${each(topStations, (station) => {
            return `<li class="svelte-dpgcga">${escape(station.station_complex)}: ${escape(station.ridership)} riders</li>`;
          })}</ul></div> <div class="hour-selector svelte-dpgcga"><label for="hour-select" class="hour-label svelte-dpgcga" data-svelte-h="svelte-11w3ycd">change hour:</label> <select id="hour-select" class="hour-select">${each(hours, (hour) => {
            return `<option${add_attribute("value", hour, 0)}>${escape(hour)}:00 - ${escape(hour + 1)}:00</option>`;
          })}</select></div> <h1 class="svelte-dpgcga" data-svelte-h="svelte-mtvsgv">Selected Station Details</h1> <div class="search-bar svelte-dpgcga"><div class="search-text svelte-dpgcga" data-svelte-h="svelte-goxd9k">search for station:</div> <div class="textbox svelte-dpgcga"><input type="text" placeholder="Type station_complex name"${add_attribute("value", typedStationName, 0)}> ${``}</div></div> <div class="button-text svelte-dpgcga" data-svelte-h="svelte-18timt2">jump to:</div> <svg width="100%" height="600"></svg> <div class="button-container svelte-dpgcga"><button class="svelte-dpgcga" data-svelte-h="svelte-41zdeu">Reset</button> <button class="svelte-dpgcga" data-svelte-h="svelte-1t9uklk">Manhattan</button> <button class="svelte-dpgcga" data-svelte-h="svelte-f08l3z">Brooklyn</button> <button class="svelte-dpgcga" data-svelte-h="svelte-1umh6my">Bronx</button> <button class="svelte-dpgcga" data-svelte-h="svelte-1kq8fae">Queens</button></div> ${selectedStation ? ` <div class="station-name svelte-dpgcga"><h2 class="svelte-dpgcga" data-svelte-h="svelte-tafa7h">station name</h2> <h3 class="svelte-dpgcga">${escape(selectedStation.station_complex)} Station</h3></div> <div class="rider-count svelte-dpgcga"><h2 class="svelte-dpgcga" data-svelte-h="svelte-wrlsf5">number of riders</h2> <h3 class="svelte-dpgcga">${escape(selectedStation.ridership)} riders</h3></div> <div class="lines-container svelte-dpgcga"><h2 class="svelte-dpgcga" data-svelte-h="svelte-2pw5pe">borough</h2> <h3 class="svelte-dpgcga">${escape(selectedStation.borough)}</h3></div> <div class="donut-chart svelte-dpgcga">${ratio !== null ? `<svg viewBox="-20 0 130 160" width="250" height="300"><rect x="5" y="5" width="100" height="140" rx="10" ry="10" fill="#f4f4ec" stroke="#ccc" stroke-width="1"></rect><circle cx="55" cy="90" r="40" fill="#ffffff"></circle><circle cx="10" cy="55" r="40" fill="transparent"${add_attribute("stroke", getStrokeColor(ratio), 0)} stroke-width="10"${add_attribute("stroke-dasharray", `${ratio * 251}, 251`, 0)} transform="rotate(-90) translate(-100)" style="transition: stroke-dasharray 0.5s ease, stroke 0.5s ease;"></circle><text x="50" y="23" font-size="9" fill="#808080" font-style="italic" font-family="Nunito, sans-serif" text-anchor="middle" dominant-baseline="middle">percent busyness
              </text><text x="55" y="90" font-size="15" font-family="Nunito, sans-serif" text-anchor="middle" dominant-baseline="middle">${escape((ratio * 100).toFixed(0))}%</text></svg>` : ``} </div>` : ` <div class="centered-text svelte-dpgcga" data-svelte-h="svelte-7xxsiw"><h2 class="svelte-dpgcga">click on a station to view details</h2></div>`}</div></section> <section style="height: 300px;" class="svelte-dpgcga" data-svelte-h="svelte-3t9w8i"><h2 class="svelte-dpgcga">Why use this tool?</h2> <p>This visualization demonstrates the critical role that data-driven insights play in navigating New York City&#39;s bustling subway system. By understanding the ebb and flow of ridership throughout the day, both locals and tourists can make informed decisions to optimize their commutes. Our visualization effectively demonstrates how analyzing ridership patterns empowers users to identify peak hours, avoid crowded stations at specific times, and plan their journeys more efficiently. In a city known for its fast-paced lifestyle, this knowledge is invaluable for ensuring seamless travel experiences and maximizing time spent exploring the diverse neighborhoods of New York City.</p></section></div>`;
        },
        background: () => {
          return `<div class="background svelte-dpgcga" slot="background" data-svelte-h="svelte-afik7u"></div>`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main>${validate_component(ScrollyTeller, "ScrollyTeller").$$render($$result, {}, {}, {})}</main>`;
});
export {
  Page as default
};
