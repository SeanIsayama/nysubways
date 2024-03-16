

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.AjsOH1QO.js","_app/immutable/chunks/scheduler.njK1qwJN.js","_app/immutable/chunks/index.bH68vdzA.js","_app/immutable/chunks/entry.BInpjeDy.js"];
export const stylesheets = [];
export const fonts = [];
