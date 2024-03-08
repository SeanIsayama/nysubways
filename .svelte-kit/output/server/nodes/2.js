

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.kZwSkXit.js","_app/immutable/chunks/scheduler.xq3EVD-W.js","_app/immutable/chunks/index.r_X1bENF.js","_app/immutable/chunks/index.zq34YaR7.js"];
export const stylesheets = ["_app/immutable/assets/2.pw3K9l5X.css"];
export const fonts = [];
