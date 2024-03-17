

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.W5udrI-6.js","_app/immutable/chunks/scheduler.njK1qwJN.js","_app/immutable/chunks/index.bH68vdzA.js"];
export const stylesheets = ["_app/immutable/assets/2.c_KvXlT8.css"];
export const fonts = [];
