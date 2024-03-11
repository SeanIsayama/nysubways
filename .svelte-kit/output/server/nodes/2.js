

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2._mrSxX7L.js","_app/immutable/chunks/scheduler.8WOK2LBS.js","_app/immutable/chunks/index.6zSKX3Pn.js"];
export const stylesheets = ["_app/immutable/assets/2.QQryPaUk.css"];
export const fonts = [];
