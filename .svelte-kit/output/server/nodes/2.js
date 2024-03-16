

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BjCp76Zm.js","_app/immutable/chunks/scheduler.8WOK2LBS.js","_app/immutable/chunks/index.UvQLejrT.js"];
export const stylesheets = ["_app/immutable/assets/2.ZWFD9W4H.css"];
export const fonts = [];
