

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.0dp1HS08.js","_app/immutable/chunks/scheduler.xq3EVD-W.js","_app/immutable/chunks/index.IIg3NcjF.js","_app/immutable/chunks/index.zq34YaR7.js"];
export const stylesheets = ["_app/immutable/assets/2.cBMNfrIs.css"];
export const fonts = [];
