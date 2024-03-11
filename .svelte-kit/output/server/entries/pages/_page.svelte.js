import { c as create_ssr_component, d as add_attribute, e as escape, f as each, v as validate_component } from "../../chunks/ssr.js";
import * as d3 from "d3";
import { scaleUtc, extent, scaleLinear } from "d3";
import mapboxgl from "mapbox-gl";
import { geoMercator } from "d3-geo";
const css$3 = {
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
  $$result.css.add(css$3);
  style = `
		position: ${"absolute"};
		top: 0;
		transform: translate(0, ${offset_top}px);
		z-index: ${1};
	`;
  widthStyle = "";
  return ` <svelte-scroller-outer class="svelte-1yjh2jm"${add_attribute("this", outer, 0)}><svelte-scroller-background-container class="background-container svelte-1yjh2jm" style="${escape(style, true) + escape(widthStyle, true)}"><svelte-scroller-background class="svelte-1yjh2jm"${add_attribute("this", background, 0)}>${slots.background ? slots.background({}) : ``}</svelte-scroller-background></svelte-scroller-background-container> <svelte-scroller-foreground class="svelte-1yjh2jm"${add_attribute("this", foreground, 0)}>${slots.foreground ? slots.foreground({}) : ``}</svelte-scroller-foreground> </svelte-scroller-outer>`;
});
const css$2 = {
  code: ".map.svelte-19f1tf7{width:50%;height:100vh;position:absolute;opacity:0;visibility:hidden;-webkit-transition:opacity 2s, visibility 2s;transition:opacity 2s, visibility 2s;outline:rgb(255, 255, 255) solid 3px}.map.visible.svelte-19f1tf7{opacity:1;visibility:visible}",
  map: null
};
const Map$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index } = $$props;
  let { geoJsonToFit } = $$props;
  mapboxgl.accessToken = "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";
  let container;
  let station_markers;
  const color_arrival = d3.scaleLinear().range(["cyan", "purple"]);
  function update_station_markers() {
    station_markers.transition().duration(1e3).attr("r", function(d) {
      if (index == d3.timeFormat("%H")(new Date(d.transit_timestamp))) {
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
      [0, 2, 5]
    );
    return scale(ridership);
  }
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.geoJsonToFit === void 0 && $$bindings.geoJsonToFit && geoJsonToFit !== void 0)
    $$bindings.geoJsonToFit(geoJsonToFit);
  $$result.css.add(css$2);
  {
    {
      if (index !== "undefined" && station_markers) {
        update_station_markers();
      }
    }
  }
  return `${$$result.head += `<!-- HEAD_svelte-1s9kg0l_START --><link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"><!-- HEAD_svelte-1s9kg0l_END -->`, ""} <div class="${["map svelte-19f1tf7", "visible"].join(" ").trim()}"${add_attribute("this", container, 0)}></div>`;
});
const css$1 = {
  code: ".chart.svelte-126meop{position:absolute;top:100px;right:100px;width:500px;height:250px;border:1px solid #ccc}.line.svelte-126meop{fill:none;stroke:steelblue;stroke-width:2}",
  map: null
};
const marginTop = 20;
const marginRight = 50;
const marginBottom = 20;
const marginLeft = 80;
const width = 500;
const height = 200;
const Line = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index } = $$props;
  let gx;
  let gy;
  let x, y;
  let lines = [];
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
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  $$result.css.add(css$1);
  x = scaleUtc().domain(extent(data, (d) => d.date)).range([marginLeft, width - marginRight]);
  y = scaleLinear().domain(extent(data, (d) => d.value)).range([height - marginBottom, marginTop]);
  lines = data.map((d, i, arr) => {
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
  return `<div class="chart svelte-126meop"><svg${add_attribute("width", width, 0)}${add_attribute("height", height + 50, 0)}><g transform="${"translate(0," + escape(height - marginBottom, true) + ")"}"${add_attribute("this", gx, 0)}></g><g transform="${"translate(" + escape(marginLeft, true) + ",0)"}"${add_attribute("this", gy, 0)}></g><g transform="${"translate(" + escape(width / 2, true) + ", " + escape(height - marginBottom / 2 + 30, true) + ")"}"><text font-size="12px" font-family="Nunito, sans-serif" fill="#000" text-anchor="middle">time of day</text></g><g transform="${"translate(" + escape(marginLeft / 2, true) + ", " + escape(height / 2, true) + ") rotate(-90)"}"><text font-size="12px" font-family="Nunito, sans-serif" fill="#000" text-anchor="middle">riders per hour (thousands)</text></g><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width / 4 - 10, 0)}${add_attribute("y", height / 2 + 70, 0)} text-anchor="middle">early morning
        </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width / 2 - 10, 0)}${add_attribute("y", height / 8 + 15, 0)} text-anchor="middle">a.m. peak
        </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width / 2 + 20, 0)}${add_attribute("y", height / 2 + 40, 0)} text-anchor="middle">midday
        </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width - 110, 0)}${add_attribute("y", height / 8 + 15, 0)} text-anchor="middle">p.m. peak
        </text><text font-family="Nunito, sans-serif" font-size="10px"${add_attribute("x", width - 50, 0)}${add_attribute("y", height / 2 + 40, 0)} text-anchor="middle">evening
        </text><g stroke="#000" stroke-opacity="0.5">${typeof index !== "undefined" && data[index] ? `${each(lines, (line, i) => {
    return `<line${add_attribute("key", i, 0)}${add_attribute("x1", line.x1, 0)}${add_attribute("y1", line.y1, 0)}${add_attribute("x2", line.x2, 0)}${add_attribute("y2", line.y2, 0)} class="line svelte-126meop" style="${"stroke: " + escape(line.color, true) + "; stroke-width: 3;"}"></line>`;
  })} ${each(data, (d, i) => {
    return `<circle${add_attribute("key", i, 0)}${add_attribute("cx", x(d.date), 0)}${add_attribute("cy", y(d.value), 0)} r="2"></circle>`;
  })}  <line${add_attribute("x1", data[index] ? x(data[index].date) : 0, 0)}${add_attribute("y1", marginTop, 0)}${add_attribute("x2", data[index] ? x(data[index].date) : 0, 0)}${add_attribute("y2", height - marginBottom, 0)} stroke="#FF0000" stroke-width="2"></line> <text font-family="Nunito, sans-serif" font-size="12px"${add_attribute("x", data[index] ? x(data[index].date) : 0, 0)}${add_attribute("y", marginTop - 8, 0)}><tspan>${escape(data[index].value)} riders</tspan> <tspan${add_attribute("x", data[index] ? x(data[index].date) : 0, 0)} dy="1.2em" font-size="9px">${escape(d3.timeFormat("%I:%M %p")(data[index].date))}</tspan></text>` : ``}</g></svg></div>`;
});
const css = {
  code: ".background.svelte-puoyqw{width:100%;height:100vh;position:relative;outline:rgb(255, 255, 255) solid 3px}.foreground.svelte-puoyqw{width:10%;position:relative;left:100%;padding-top:500px}section.svelte-puoyqw{position:relative;height:20vh;background-color:white;outline:black solid 3px;color:black;padding-left:60px;margin:0 0 0 em 0;border-left:3px solid black}.hour-label.svelte-puoyqw{position:absolute;left:-60px;top:0%;-webkit-transform:translateY(-50%);transform:translateY(-50%);padding:0 10px}.stations-container.svelte-puoyqw{position:absolute;top:500;left:-60;width:100%;height:calc(100% - 500px)}.station.svelte-puoyqw{position:absolute;width:2px;height:calc(100% - 500px);background-color:black}.station-label.svelte-puoyqw{position:absolute;top:0;background-color:white;padding:0 5px}.station-line.svelte-puoyqw{position:absolute;top:0;bottom:0;background-color:black}.progress-bars.svelte-puoyqw{position:absolute;top:10px;left:10px;z-index:999}",
  map: null
};
const ScrollyTeller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let count, index, offset, progress;
  let width2, height2;
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
          return `<div class="foreground svelte-puoyqw" slot="foreground"><div class="stations-container svelte-puoyqw">${each(["Station 1", "Station 2", "Station 3"], (station, i) => {
            return `<div class="station svelte-puoyqw" style="${"left: " + escape(i * 33, true) + "%;"}"><span class="station-label svelte-puoyqw">${escape(station)}</span> <div class="station-line svelte-puoyqw"></div> </div>`;
          })}</div> ${each(Array(24), (_, i) => {
            return `<section class="svelte-puoyqw"><span class="hour-label svelte-puoyqw">${escape(i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`)}</span> </section>`;
          })}</div>`;
        },
        background: () => {
          return `<div class="background svelte-puoyqw" slot="background">${validate_component(Map$1, "Map").$$render(
            $$result,
            { index, geoJsonToFit },
            {
              geoJsonToFit: ($$value) => {
                geoJsonToFit = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Line, "Line").$$render($$result, { index }, {}, {})}  <div class="progress-bars svelte-puoyqw"><p>current hour: <strong>${escape(index + 1)}/${escape(count)}</strong></p> <progress${add_attribute("value", count ? (index + 1) / count : 0, 0)}></progress></div></div>`;
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
