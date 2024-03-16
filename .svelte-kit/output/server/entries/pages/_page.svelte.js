import { c as create_ssr_component, d as add_attribute, e as escape, f as createEventDispatcher, v as validate_component, h as each } from "../../chunks/ssr.js";
import * as d3 from "d3";
import { scaleUtc, extent, scaleLinear } from "d3";
import mapboxgl from "mapbox-gl";
import { geoMercator } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
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
  if ($$props.busyness === void 0 && $$bindings.busyness && busyness !== void 0)
    $$bindings.busyness(busyness);
  if ($$props.geoJsonToFit === void 0 && $$bindings.geoJsonToFit && geoJsonToFit !== void 0)
    $$bindings.geoJsonToFit(geoJsonToFit);
  if ($$props.topStations === void 0 && $$bindings.topStations && topStations !== void 0)
    $$bindings.topStations(topStations);
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
  return `<div class="chart"><svg${add_attribute("width", width, 0)}${add_attribute("height", height + 50, 0)}><g transform="${"translate(0," + escape(height - marginBottom, true) + ")"}"${add_attribute("this", gx, 0)}></g><g transform="${"translate(" + escape(marginLeft, true) + ",0)"}"${add_attribute("this", gy, 0)}></g><g transform="${"translate(" + escape(width / 2, true) + ", " + escape(height - marginBottom / 2 + 30, true) + ")"}"><text font-size="12px" font-family="Nunito, sans-serif" fill="#000" text-anchor="middle">time of day</text></g><g transform="${"translate(" + escape(marginLeft / 2, true) + ", " + escape(height / 2, true) + ") rotate(-90)"}"><text font-size="12px" font-family="Nunito, sans-serif" fill="#000" text-anchor="middle">riders per hour (thousands)</text></g><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width / 4 - 10, 0)}${add_attribute("y", height / 2 + 70, 0)} text-anchor="middle">early morning
      </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width / 2 - 10, 0)}${add_attribute("y", height / 8 + 15, 0)} text-anchor="middle">a.m. peak
      </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width / 2 + 20, 0)}${add_attribute("y", height / 2 + 40, 0)} text-anchor="middle">midday
      </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width - 110, 0)}${add_attribute("y", height / 8 + 15, 0)} text-anchor="middle">p.m. peak
      </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width - 50, 0)}${add_attribute("y", height / 2 + 40, 0)} text-anchor="middle">evening
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
    "never sleeps,' is home to around 8 million residents as of 2024. This",
    "vast community relies extensively on the efficiency and ",
    "accessibility of public transportation networks, such as the ",
    "iconic subway system, to sustain its vibrancy and fuel its economic ",
    "growth and prosperity."
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
    text.selectAll("tspan").data(lines.filter((_, i) => i <= 6)).enter().append("tspan").attr("x", 850).attr("dy", (d, i) => i === 0 ? 0 : "1.2em").text(
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
      " 32% use the subway. This totals up to close to 2.5 million"
    );
    text.append("tspan").attr("x", 850).attr("y", 240).text(
      "commuters that use the NYC subway network."
    );
    text.selectAll("tspan").filter((_, i) => i >= 7).style("opacity", 0).transition().duration(
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
        ).attr("y", 256).attr("opacity", 0).transition().duration(
          500
          // Apply transition for fading in effect // Duration of the transition
        ).attr("opacity", 0.7);
      },
      500
    );
    text.append("tspan").attr("x", 890).attr("y", 270).text(" = 100 subway cars").style("font-style", "italic");
    text.append("tspan").attr("x", 850).attr("y", 300).text(
      "On the other hand, thre are only around 6400 subways cars,"
    );
    text.append("tspan").attr("x", 850).attr("y", 320).text(
      "acccording to the MTA. These cars fit an average of 200"
    );
    text.append("tspan").attr("x", 850).attr("y", 340).text(
      "people, meaning even if all subway cars were in use and "
    );
    text.append("tspan").attr("x", 850).attr("y", 360).text(
      "in full capacity, it could only carry around 1/2 of all"
    );
    text.append("tspan").attr("x", 850).attr("y", 380).text(
      "NYC commuters."
    );
    text.selectAll("tspan").filter((_, i) => i >= 10).style("opacity", 0).transition().duration(
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
    text.append("tspan").attr("x", 850).attr("y", 420).text(
      "In addition, the annual 56.7 million visitors recorded in"
    );
    text.append("tspan").attr("x", 850).attr("y", 440).text(
      "2022 will only make the MTA subways even more populated,"
    );
    text.append("tspan").attr("x", 850).attr("y", 460).text(
      "making navigation in these subways more difficult, stressful,"
    );
    text.append("tspan").attr("x", 850).attr("y", 480).text(
      "and challenging. This makes avoiding rushes and navigating"
    );
    text.append("tspan").attr("x", 850).attr("y", 500).text(
      "seem near impossible. However, as of many things in life,"
    );
    text.append("tspan").attr("x", 850).attr("y", 520).text(
      "there are tools and strategies for optimal navigation in the "
    );
    text.append("tspan").attr("x", 850).attr("y", 540).text(
      "NYC subways."
    );
    text.append("tspan").attr("x", 400).attr("y", 550).style(
      "font-family",
      "Nunito, sans-serif"
    ).text("Influx of tourists");
    text.append("tspan").attr("x", 100).attr("y", 170).style(
      "font-family",
      "Nunito, sans-serif"
    ).text("Leftover residents");
    text.selectAll("tspan").filter((_, i) => i >= 16).style("opacity", 0).transition().duration(
      1e3
      // Apply transition for fading in effect // Duration of the transition
    ).style("opacity", 1);
  }
  function finalQuestion() {
    select("svg");
    text.append("tspan").attr("x", 30).attr("y", 270).style("font-family", "Nunito, sans-serif").style("font-weight", "bold").style("font-size", "24px").text("So, what is the most optimal way to navigate the NYC subway?");
    text.selectAll("tspan").filter((_, i) => i >= 25).style("opacity", 0).transition().duration(
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
  code: '.header.svelte-48mwv9.svelte-48mwv9{font-family:"Nunito", sans-serif;background-color:#d9d9d9;padding:20px;border-bottom:2px solid #ccc}.header-content.svelte-48mwv9.svelte-48mwv9{background-color:"#d9d9d9";display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between}.section-text.svelte-48mwv9.svelte-48mwv9{-webkit-box-flex:1;flex:1;margin-right:20px}h1.svelte-48mwv9.svelte-48mwv9{font-size:50px}h2.svelte-48mwv9.svelte-48mwv9{font-size:20px;font-family:Nunito, sans-serif}h3.svelte-48mwv9.svelte-48mwv9{font-size:18px;font-family:Nunito, sans-serif}.foreground.svelte-48mwv9.svelte-48mwv9{width:100%;position:relative;background-color:#f0f0f0;z-index:0}.background.svelte-48mwv9.svelte-48mwv9{width:100%;height:100vh;position:relative;outline:rgb(255, 255, 255) solid 3px;z-index:1}section.svelte-48mwv9.svelte-48mwv9{height:100vh;width:91.5%;position:relative;background-color:#f0f0f0;padding-left:60px;padding-right:60px}.progress-bars.svelte-48mwv9.svelte-48mwv9{position:fixed;top:0px;right:20px;z-index:999}.fixed-graph.svelte-48mwv9.svelte-48mwv9{position:sticky;top:50px;z-index:999}.hour-selector.svelte-48mwv9.svelte-48mwv9{font-style:italic;font-family:"Nunito", sans-serif;position:absolute;top:25%;right:42%;-webkit-transform:translateY(-50%);transform:translateY(-50%);z-index:999}.hour-label.svelte-48mwv9.svelte-48mwv9{margin-bottom:5px}.top-stations.svelte-48mwv9.svelte-48mwv9{font-family:"Nunito", sans-serif;right:50%;-webkit-transform:translateX(50%);transform:translateX(50%);width:75%;top:1%;border:2px solid #ccc;border-radius:10px;position:absolute;z-index:9}.top-stations.svelte-48mwv9 h2.svelte-48mwv9{text-align:center;margin-bottom:10px}.top-stations.svelte-48mwv9 ul.svelte-48mwv9{list-style-type:decimal}.top-stations.svelte-48mwv9 li.svelte-48mwv9{font-family:"Nunito", sans-serif}.menu-container.svelte-48mwv9.svelte-48mwv9{position:absolute;top:5%;right:0%;width:30%;height:100%;border:2px solid rgb(145, 144, 144);border-radius:10px;-webkit-transition:border-width 0.3s;transition:border-width 0.3s}.menu-container.svelte-48mwv9 h1.svelte-48mwv9{text-align:center;font-family:"Nunito", sans-serif;font-size:20px;margin-top:220px}.station-name.svelte-48mwv9.svelte-48mwv9{height:14%;width:88%;right:3%;position:absolute;z-index:9;top:33%;padding:10px;border:2px solid #ccc;border-radius:10px;background-color:#f4f4ec}.station-name.svelte-48mwv9 h2.svelte-48mwv9{font-size:15px;color:#808080;font-style:italic;font-weight:530;font-family:"Nunito", sans-serif}.station-name.svelte-48mwv9 h3.svelte-48mwv9{margin-top:-5px;font-size:28px;color:black;font-weight:bold;font-family:"Nunito", sans-serif}.rider-count.svelte-48mwv9.svelte-48mwv9{height:15%;width:42%;right:3%;position:absolute;z-index:9;top:51%;padding:10px;border:2px solid #ccc;border-radius:10px;background-color:#f4f4ec}.rider-count.svelte-48mwv9 h2.svelte-48mwv9{font-size:15px;color:#808080;font-style:italic;font-weight:530;font-family:"Nunito", sans-serif}.rider-count.svelte-48mwv9 h3.svelte-48mwv9{margin-top:-5px;font-size:25px;color:black;font-weight:bold;font-family:"Nunito", sans-serif}.donut-chart.svelte-48mwv9.svelte-48mwv9{right:50%;position:absolute;z-index:9;top:50%\n}.centered-text.svelte-48mwv9.svelte-48mwv9{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%, 100%);transform:translate(-50%, 100%)}.centered-text.svelte-48mwv9 h2.svelte-48mwv9{font-size:15px;color:#808080;font-style:italic;font-weight:normal;font-family:"Nunito", sans-serif}',
  map: null
};
const ScrollyTeller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
          return `<div class="foreground svelte-48mwv9" slot="foreground"><div class="progress-bars svelte-48mwv9"><p>current section: <strong>${escape(index + 1)}/${escape(count)}</strong></p> <progress${add_attribute("value", count ? (index + 1) / count : 0, 0)}></progress> <p>offset in current section: <strong>${escape(parseFloat(offset).toFixed(2))}/1</strong></p> <progress${add_attribute("value", offset || 0, 0)}></progress></div> <section style="height: 400px; background-color: #d9d9d9;" class="svelte-48mwv9" data-svelte-h="svelte-1nnkr4a"><div class="header svelte-48mwv9" background-color="#d9d9d9"><div class="header-content svelte-48mwv9"><div class="section-text svelte-48mwv9"><h1 class="svelte-48mwv9">A Deep Dive into MTA Data</h1> <h2 class="svelte-48mwv9">An interactive tool for New York City&#39;s subway system navigation</h2></div></div></div></section> <section style="height: 3600px;" class="svelte-48mwv9"><div class="fixed-graph svelte-48mwv9"><h2 class="svelte-48mwv9" data-svelte-h="svelte-73zzey">The Issue</h2> ${validate_component(Graph, "Graph").$$render($$result, { index, offset }, {}, {})}</div></section> <section class="svelte-48mwv9"><h2 class="svelte-48mwv9" data-svelte-h="svelte-kirs69">The Common Strategy</h2> <p data-svelte-h="svelte-1usfmoq">The most common strategy in which almost all tourists and commuters use to navitage subways efficiently is to identify when these subways are most/least populated. By doing to, people are able to avoid &quot;rush&quot; periods, and utilize the subway when it is less &quot;rushed&quot;. The line plot below   depicts the number of riders per hour throughout a randomly chosen weekday.</p> <p style="font-size: 14px; font-style: italic;" data-svelte-h="svelte-p2qpz7">*For the plot below, we have depicted data for the day February 01, 2024, obtained from data.ny.gov</p> ${validate_component(Line, "Line").$$render($$result, {}, {}, {})}</section> <section class="svelte-48mwv9" data-svelte-h="svelte-xzfoxw">section 3.</section> <section class="svelte-48mwv9"><h2 class="svelte-48mwv9" data-svelte-h="svelte-1nk6x48">Our Interactive Nagivation Tool</h2> ${validate_component(Map$1, "Map").$$render($$result, { busyness, geoJsonToFit, topStations }, {}, {})} <div class="menu-container svelte-48mwv9"><div class="top-stations svelte-48mwv9"><h2 class="svelte-48mwv9" data-svelte-h="svelte-6g4uqy">Busiest stations at this time</h2> <ul class="svelte-48mwv9">${each(topStations, (station) => {
            return `<li class="svelte-48mwv9">${escape(station.station_complex)}: ${escape(station.ridership)} riders</li>`;
          })}</ul></div> <div class="hour-selector svelte-48mwv9"><label for="hour-select" class="hour-label svelte-48mwv9" data-svelte-h="svelte-1cgcp37">Change hour here:</label> <select id="hour-select" class="hour-select">${each(hours, (hour) => {
            return `<option${add_attribute("value", hour, 0)}>${escape(hour)}:00 - ${escape(hour + 1)}:00</option>`;
          })}</select></div> <h1 class="svelte-48mwv9" data-svelte-h="svelte-mtvsgv">Selected Station Details</h1> ${` <div class="centered-text svelte-48mwv9" data-svelte-h="svelte-7xxsiw"><h2 class="svelte-48mwv9">click on a station to view details</h2></div>`}</div></section></div>`;
        },
        background: () => {
          return `<div class="background svelte-48mwv9" slot="background" data-svelte-h="svelte-afik7u"></div>`;
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
