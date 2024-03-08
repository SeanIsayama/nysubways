

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.2JDS9YO0.js","_app/immutable/chunks/scheduler.8WOK2LBS.js","_app/immutable/chunks/index.6zSKX3Pn.js","_app/immutable/chunks/entry.-v7xZ8Py.js"];
export const stylesheets = [];
export const fonts = [];
