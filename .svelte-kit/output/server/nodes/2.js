

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.gboqlDZ9.js","_app/immutable/chunks/scheduler.njK1qwJN.js","_app/immutable/chunks/index.bH68vdzA.js"];
export const stylesheets = ["_app/immutable/assets/2.kQJtrU7z.css"];
export const fonts = [];
