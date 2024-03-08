import { n as noop, c as create_ssr_component, b as add_attribute, e as escape, d as each, f as assign, i as identity, a as subscribe, v as validate_component } from "../../chunks/ssr.js";
import * as d3 from "d3";
import { scaleUtc, extent, scaleLinear } from "d3";
import mapboxgl from "mapbox-gl";
import { geoMercator } from "d3-geo";
import { w as writable } from "../../chunks/index.js";
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
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
  code: ".map.svelte-19f1tf7{width:50%;height:100vh;position:absolute;opacity:0;visibility:hidden;-webkit-transition:opacity 2s, visibility 2s;transition:opacity 2s, visibility 2s;outline:rgb(255, 255, 255) solid 3px}.map.visible.svelte-19f1tf7{opacity:1;visibility:visible}",
  map: null
};
const Map$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index } = $$props;
  let { geoJsonToFit } = $$props;
  mapboxgl.accessToken = "pk.eyJ1IjoiZXZvY29kZSIsImEiOiJjbHNrc2JwejYwMzJ4Mm1sZm9rNXFxMzBpIn0.RLaeumLJ5YbXoasg3XQnTw";
  let container;
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.geoJsonToFit === void 0 && $$bindings.geoJsonToFit && geoJsonToFit !== void 0)
    $$bindings.geoJsonToFit(geoJsonToFit);
  $$result.css.add(css$3);
  return `${$$result.head += `<!-- HEAD_svelte-1s9kg0l_START --><link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"><!-- HEAD_svelte-1s9kg0l_END -->`, ""} <div class="${["map svelte-19f1tf7", "visible"].join(" ").trim()}"${add_attribute("this", container, 0)}></div>`;
});
const css$2 = {
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
  let max;
  let gx;
  let gy;
  let x, y;
  let lines = [];
  let data = [];
  const customLabelsX = ["1 am", "4 am", "7 am", "10 am", "1 pm", "4 pm", "7 pm", "10 pm"];
  const customLabelsY = ["50", "100", "150", "200", "250"];
  $$result.css.add(css$2);
  {
    console.log(data);
  }
  x = scaleUtc().domain(extent(data, (d) => d.date)).range([marginLeft, width - marginRight]);
  y = scaleLinear().domain(extent(data, (d) => d.value)).range([height - marginBottom, marginTop]);
  lines = data.map((d, i, arr) => {
    if (i === 0)
      return null;
    return {
      x1: x(arr[i - 1].date),
      y1: y(arr[i - 1].value),
      x2: x(d.date),
      y2: y(d.value)
    };
  }).filter((d) => d !== null);
  max = d3.max(data, (d) => Math.abs(d.value));
  d3.scaleSequential().domain([max, -max]).interpolator(d3.interpolateRdBu);
  {
    d3.select(gx).call(d3.axisBottom(x).ticks(8).tickFormat((d, i) => customLabelsX[i]));
  }
  {
    d3.select(gy).call(d3.axisLeft(y).ticks(4).tickFormat((d, i) => customLabelsY[i]));
  }
  return `<div class="chart svelte-126meop"><svg${add_attribute("width", width, 0)}${add_attribute("height", height + 50, 0)}><g transform="${"translate(0," + escape(height - marginBottom, true) + ")"}"${add_attribute("this", gx, 0)}></g><g transform="${"translate(" + escape(marginLeft, true) + ",0)"}"${add_attribute("this", gy, 0)}></g><g transform="${"translate(" + escape(width / 2, true) + ", " + escape(height - marginBottom / 2 + 30, true) + ")"}"><text fill="#000" text-anchor="middle">time of day</text></g><g transform="${"translate(" + escape(marginLeft / 2, true) + ", " + escape(height / 2, true) + ") rotate(-90)"}"><text fill="#000" text-anchor="middle">riders per hour (thousands)</text></g><g stroke="#000" stroke-opacity="0.2">${each(lines, (line, i) => {
    return `<line${add_attribute("key", i, 0)}${add_attribute("x1", line.x1, 0)}${add_attribute("y1", line.y1, 0)}${add_attribute("x2", line.x2, 0)}${add_attribute("y2", line.y2, 0)} class="line svelte-126meop"></line>`;
  })}${each(data, (d, i) => {
    return `<circle${add_attribute("key", i, 0)}${add_attribute("cx", x(d.date), 0)}${add_attribute("cy", y(d.value), 0)} r="2"></circle>`;
  })}</g></svg></div>`;
});
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const troops = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24,
          54.9
        ]
      },
      "properties": {
        "survivors": 34e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.5,
          55
        ]
      },
      "properties": {
        "survivors": 34e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.5,
          54.5
        ]
      },
      "properties": {
        "survivors": 34e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          26,
          54.7
        ]
      },
      "properties": {
        "survivors": 32e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          27,
          54.8
        ]
      },
      "properties": {
        "survivors": 3e5,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28,
          54.9
        ]
      },
      "properties": {
        "survivors": 28e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28.5,
          55
        ]
      },
      "properties": {
        "survivors": 24e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          29,
          55.1
        ]
      },
      "properties": {
        "survivors": 21e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          30,
          55.2
        ]
      },
      "properties": {
        "survivors": 18e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          30.3,
          55.3
        ]
      },
      "properties": {
        "survivors": 175e3,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          32,
          54.8
        ]
      },
      "properties": {
        "survivors": 145e3,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          33.2,
          54.9
        ]
      },
      "properties": {
        "survivors": 14e4,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          34.4,
          55.5
        ]
      },
      "properties": {
        "survivors": 127100,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          35.5,
          55.4
        ]
      },
      "properties": {
        "survivors": 1e5,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          36,
          55.5
        ]
      },
      "properties": {
        "survivors": 1e5,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          37.6,
          55.8
        ]
      },
      "properties": {
        "survivors": 1e5,
        "direction": "A",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          37.7,
          55.7
        ]
      },
      "properties": {
        "survivors": 1e5,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          37.5,
          55.7
        ]
      },
      "properties": {
        "survivors": 98e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          37,
          55
        ]
      },
      "properties": {
        "survivors": 97e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          36.8,
          55
        ]
      },
      "properties": {
        "survivors": 96e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          35.4,
          55.3
        ]
      },
      "properties": {
        "survivors": 87e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          34.3,
          55.2
        ]
      },
      "properties": {
        "survivors": 55e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          33.3,
          54.8
        ]
      },
      "properties": {
        "survivors": 37e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          32,
          54.6
        ]
      },
      "properties": {
        "survivors": 24e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          30.4,
          54.4
        ]
      },
      "properties": {
        "survivors": 2e4,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          29.2,
          54.3
        ]
      },
      "properties": {
        "survivors": 2e4,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28.5,
          54.2
        ]
      },
      "properties": {
        "survivors": 2e4,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28.3,
          54.3
        ]
      },
      "properties": {
        "survivors": 2e4,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          27.5,
          54.5
        ]
      },
      "properties": {
        "survivors": 2e4,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          26.8,
          54.3
        ]
      },
      "properties": {
        "survivors": 12e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          26.4,
          54.4
        ]
      },
      "properties": {
        "survivors": 14e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          25,
          54.4
        ]
      },
      "properties": {
        "survivors": 8e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.4,
          54.4
        ]
      },
      "properties": {
        "survivors": 4e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.2,
          54.4
        ]
      },
      "properties": {
        "survivors": 4e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.1,
          54.4
        ]
      },
      "properties": {
        "survivors": 4e3,
        "direction": "R",
        "group": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24,
          55.1
        ]
      },
      "properties": {
        "survivors": 6e4,
        "direction": "A",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.5,
          55.2
        ]
      },
      "properties": {
        "survivors": 6e4,
        "direction": "A",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.5,
          54.7
        ]
      },
      "properties": {
        "survivors": 6e4,
        "direction": "A",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          26.6,
          55.7
        ]
      },
      "properties": {
        "survivors": 4e4,
        "direction": "A",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          27.4,
          55.6
        ]
      },
      "properties": {
        "survivors": 33e3,
        "direction": "A",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28.7,
          55.5
        ]
      },
      "properties": {
        "survivors": 33e3,
        "direction": "A",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28.7,
          55.5
        ]
      },
      "properties": {
        "survivors": 33e3,
        "direction": "R",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          29.2,
          54.2
        ]
      },
      "properties": {
        "survivors": 3e4,
        "direction": "R",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28.5,
          54.1
        ]
      },
      "properties": {
        "survivors": 3e4,
        "direction": "R",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          28.3,
          54.2
        ]
      },
      "properties": {
        "survivors": 28e3,
        "direction": "R",
        "group": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24,
          55.2
        ]
      },
      "properties": {
        "survivors": 22e3,
        "direction": "A",
        "group": 3
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.5,
          55.3
        ]
      },
      "properties": {
        "survivors": 22e3,
        "direction": "A",
        "group": 3
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.6,
          55.8
        ]
      },
      "properties": {
        "survivors": 6e3,
        "direction": "A",
        "group": 3
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.6,
          55.8
        ]
      },
      "properties": {
        "survivors": 6e3,
        "direction": "R",
        "group": 3
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.2,
          54.4
        ]
      },
      "properties": {
        "survivors": 6e3,
        "direction": "R",
        "group": 3
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          24.1,
          54.4
        ]
      },
      "properties": {
        "survivors": 6e3,
        "direction": "R",
        "group": 3
      }
    }
  ]
};
const css$1 = {
  code: ".graph.svelte-1x599og{width:100%;height:100vh;position:absolute;outline:rgb(255, 255, 255) solid 7px}",
  map: null
};
const Graph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pointsStringA1;
  let pointsStringA2;
  let pointsStringA3;
  let pointsStringR1;
  let pointsStringR2;
  let pointsStringR3;
  let $strokeWidth, $$unsubscribe_strokeWidth;
  let { index, width: width2, height: height2, projection } = $$props;
  const filter_troopsAttack1 = (feature) => {
    return feature.properties.direction === "A" && feature.properties.group === 1;
  };
  const filter_troopsAttack2 = (feature) => {
    return feature.properties.direction === "A" && feature.properties.group === 2;
  };
  const filter_troopsAttack3 = (feature) => {
    return feature.properties.direction === "A" && feature.properties.group === 3;
  };
  const filter_troopsRetreat1 = (feature) => {
    return feature.properties.direction === "R" && feature.properties.group === 1;
  };
  const filter_troopsRetreat2 = (feature) => {
    return feature.properties.direction === "R" && feature.properties.group === 2;
  };
  const filter_troopsRetreat3 = (feature) => {
    return feature.properties.direction === "R" && feature.properties.group === 3;
  };
  const troopsAttack1 = troops.features.filter(filter_troopsAttack1);
  const troopsAttack2 = troops.features.filter(filter_troopsAttack2);
  const troopsAttack3 = troops.features.filter(filter_troopsAttack3);
  const troopsRetreat1 = troops.features.filter(filter_troopsRetreat1);
  const troopsRetreat2 = troops.features.filter(filter_troopsRetreat2);
  const troopsRetreat3 = troops.features.filter(filter_troopsRetreat3);
  let strokeWidth = tweened(1, { duration: 5e3, easing: cubicOut });
  $$unsubscribe_strokeWidth = subscribe(strokeWidth, (value) => $strokeWidth = value);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.width === void 0 && $$bindings.width && width2 !== void 0)
    $$bindings.width(width2);
  if ($$props.height === void 0 && $$bindings.height && height2 !== void 0)
    $$bindings.height(height2);
  if ($$props.projection === void 0 && $$bindings.projection && projection !== void 0)
    $$bindings.projection(projection);
  $$result.css.add(css$1);
  pointsStringA1 = troopsAttack1.map((feature) => {
    const transformedCoordinates = projection(feature.geometry.coordinates);
    return transformedCoordinates.join(",");
  }).join(" ");
  pointsStringA2 = troopsAttack2.map((feature) => {
    const transformedCoordinates = projection(feature.geometry.coordinates);
    return transformedCoordinates.join(",");
  }).join(" ");
  pointsStringA3 = troopsAttack3.map((feature) => {
    const transformedCoordinates = projection(feature.geometry.coordinates);
    return transformedCoordinates.join(",");
  }).join(" ");
  pointsStringR1 = troopsRetreat1.map((feature) => {
    const transformedCoordinates = projection(feature.geometry.coordinates);
    return transformedCoordinates.join(",");
  }).join(" ");
  pointsStringR2 = troopsRetreat2.map((feature) => {
    const transformedCoordinates = projection(feature.geometry.coordinates);
    return transformedCoordinates.join(",");
  }).join(" ");
  pointsStringR3 = troopsRetreat3.map((feature) => {
    const transformedCoordinates = projection(feature.geometry.coordinates);
    return transformedCoordinates.join(",");
  }).join(" ");
  {
    {
      if (index > 4) {
        strokeWidth.set(10);
      }
      if (index <= 4) {
        strokeWidth.set(0);
      }
    }
  }
  $$unsubscribe_strokeWidth();
  return `<svg class="graph svelte-1x599og">${index > 0 ? `${index > 2 ? `<polyline${add_attribute("points", pointsStringA1, 0)} fill="none" stroke="#FFCCBC" stroke-width="3"></polyline> <polyline${add_attribute("points", pointsStringA2, 0)} fill="none" stroke="#FFCCBC" stroke-width="3"></polyline> <polyline${add_attribute("points", pointsStringA3, 0)} fill="none" stroke="#FFCCBC" stroke-width="3"></polyline>` : ``} ${index > 3 ? `<polyline${add_attribute("points", pointsStringR1, 0)} fill="none" stroke="#050505" stroke-width="3"></polyline> <polyline${add_attribute("points", pointsStringR2, 0)} fill="none" stroke="#050505" stroke-width="3"></polyline> <polyline${add_attribute("points", pointsStringR3, 0)} fill="none" stroke="#050505" stroke-width="3"></polyline>` : ``} ${index > 3 ? `${each(troopsAttack1, (troop, i) => {
    return `${i > 0 ? `<line${add_attribute("x1", projection(troopsAttack1[i - 1].geometry.coordinates)[0], 0)}${add_attribute("y1", projection(troopsAttack1[i - 1].geometry.coordinates)[1], 0)}${add_attribute("x2", projection(troopsAttack1[i].geometry.coordinates)[0], 0)}${add_attribute("y2", projection(troopsAttack1[i].geometry.coordinates)[1], 0)} stroke="#FFCCBC"${add_attribute("stroke-width", $strokeWidth * (troopsAttack1[i].properties.survivors / 5e4), 0)}></line>` : ``}`;
  })} ${each(troopsAttack2, (troop, i) => {
    return `${i > 0 ? `<line${add_attribute("x1", projection(troopsAttack2[i - 1].geometry.coordinates)[0], 0)}${add_attribute("y1", projection(troopsAttack2[i - 1].geometry.coordinates)[1], 0)}${add_attribute("x2", projection(troopsAttack2[i].geometry.coordinates)[0], 0)}${add_attribute("y2", projection(troopsAttack2[i].geometry.coordinates)[1], 0)} stroke="#FFCCBC"${add_attribute("stroke-width", $strokeWidth * (troopsAttack2[i].properties.survivors / 5e4), 0)}></line>` : ``}`;
  })} ${each(troopsAttack3, (troop, i) => {
    return `${i > 0 ? `<line${add_attribute("x1", projection(troopsAttack3[i - 1].geometry.coordinates)[0], 0)}${add_attribute("y1", projection(troopsAttack3[i - 1].geometry.coordinates)[1], 0)}${add_attribute("x2", projection(troopsAttack3[i].geometry.coordinates)[0], 0)}${add_attribute("y2", projection(troopsAttack3[i].geometry.coordinates)[1], 0)} stroke="#FFCCBC"${add_attribute("stroke-width", $strokeWidth * (troopsAttack3[i].properties.survivors / 5e4), 0)}></line>` : ``}`;
  })} ${each(troopsRetreat1, (troop, i) => {
    return `${i > 0 ? `<line${add_attribute("x1", projection(troopsRetreat1[i - 1].geometry.coordinates)[0], 0)}${add_attribute("y1", projection(troopsRetreat1[i - 1].geometry.coordinates)[1], 0)}${add_attribute("x2", projection(troopsRetreat1[i].geometry.coordinates)[0], 0)}${add_attribute("y2", projection(troopsRetreat1[i].geometry.coordinates)[1], 0)} stroke="#050505"${add_attribute("stroke-width", $strokeWidth * (troopsRetreat1[i].properties.survivors / 5e4), 0)}></line>` : ``}`;
  })} ${each(troopsRetreat2, (troop, i) => {
    return `${i > 0 ? `<line${add_attribute("x1", projection(troopsRetreat2[i - 1].geometry.coordinates)[0], 0)}${add_attribute("y1", projection(troopsRetreat2[i - 1].geometry.coordinates)[1], 0)}${add_attribute("x2", projection(troopsRetreat2[i].geometry.coordinates)[0], 0)}${add_attribute("y2", projection(troopsRetreat2[i].geometry.coordinates)[1], 0)} stroke="#050505"${add_attribute("stroke-width", $strokeWidth * (troopsRetreat2[i].properties.survivors / 5e4), 0)}></line>` : ``}`;
  })} ${each(troopsAttack3, (troop, i) => {
    return `${i > 0 ? `<line${add_attribute("x1", projection(troopsRetreat3[i - 1].geometry.coordinates)[0], 0)}${add_attribute("y1", projection(troopsRetreat3[i - 1].geometry.coordinates)[1], 0)}${add_attribute("x2", projection(troopsRetreat3[i].geometry.coordinates)[0], 0)}${add_attribute("y2", projection(troopsRetreat3[i].geometry.coordinates)[1], 0)} stroke="#050505"${add_attribute("stroke-width", $strokeWidth * (troopsRetreat3[i].properties.survivors / 5e4), 0)}></line>` : ``}`;
  })}` : ``} ${each(tweenedData, (city, i) => {
    return `${city.x && city.y ? `<text${add_attribute("x", city.x, 0)}${add_attribute("y", city.y, 0)}${add_attribute("id", city.properties.name, 0)}>${escape(city.properties.city)}</text>` : ``}`;
  })}` : ``}</svg>`;
});
const css = {
  code: ".background.svelte-1f9qrg4{width:100%;height:100vh;position:relative;outline:green solid 3px}.foreground.svelte-1f9qrg4{width:10%;position:relative;left:100%;padding-top:500px}section.svelte-1f9qrg4{position:relative;height:20vh;background-color:white;outline:black solid 3px;color:black;padding-left:60px;margin:0 0 0 em 0;border-left:3px solid black}.hour-label.svelte-1f9qrg4{position:absolute;left:-60px;top:0%;-webkit-transform:translateY(-50%);transform:translateY(-50%);padding:0 10px}.stations-container.svelte-1f9qrg4{position:absolute;top:500;left:-60;width:100%;height:calc(100%-500px)}.station.svelte-1f9qrg4{position:absolute;width:2px;height:calc(100% - 500px);background-color:black}.station-label.svelte-1f9qrg4{position:absolute;top:0;background-color:white;padding:0 5px}.station-line.svelte-1f9qrg4{position:absolute;top:0;bottom:0;background-color:black}",
  map: null
};
const ScrollyTeller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let projection;
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
    projection = geoMercator().fitSize([width2, height2], geoJsonToFit);
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
          return `<div class="foreground svelte-1f9qrg4" slot="foreground"><div class="stations-container svelte-1f9qrg4">${each(["Station 1", "Station 2", "Station 3"], (station, i) => {
            return `<div class="station svelte-1f9qrg4" style="${"left: " + escape(i * 33, true) + "%;"}"><span class="station-label svelte-1f9qrg4">${escape(station)}</span> <div class="station-line svelte-1f9qrg4"></div> </div>`;
          })}</div> ${each(Array(24), (_, i) => {
            return `<section class="svelte-1f9qrg4"><span class="hour-label svelte-1f9qrg4">${escape(i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`)}</span> </section>`;
          })}</div>`;
        },
        background: () => {
          return `<div class="background svelte-1f9qrg4" slot="background">${validate_component(Map$1, "Map").$$render(
            $$result,
            { index, geoJsonToFit },
            {
              geoJsonToFit: ($$value) => {
                geoJsonToFit = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Line, "Line").$$render($$result, {}, {}, {})} ${validate_component(Graph, "Graph").$$render($$result, { index, width: width2, height: height2, projection }, {}, {})} <div class="progress-bars"><p>current hour: <strong>${escape(index + 1)}/${escape(count)}</strong></p> <progress${add_attribute("value", count ? (index + 1) / count : 0, 0)}></progress> <p data-svelte-h="svelte-1l3bttw">offset in current section</p> <progress${add_attribute("value", offset || 0, 0)}></progress> <p data-svelte-h="svelte-1tgmlrf">total progress</p> <progress${add_attribute("value", progress || 0, 0)}></progress></div></div>`;
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
