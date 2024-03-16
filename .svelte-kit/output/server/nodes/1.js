

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.8LL92N1h.js","_app/immutable/chunks/scheduler.8WOK2LBS.js","_app/immutable/chunks/index.UvQLejrT.js","_app/immutable/chunks/entry.QCEGP8w5.js"];
export const stylesheets = [];
export const fonts = [];
