

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.dFv-YB6x.js","_app/immutable/chunks/scheduler.njK1qwJN.js","_app/immutable/chunks/index.bH68vdzA.js","_app/immutable/chunks/entry.s8v0OGhH.js"];
export const stylesheets = [];
export const fonts = [];
