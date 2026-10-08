/** Prefixes a public path with the deploy base path (GitHub Pages serves the site from /<repo>/). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Admin preview only: not-yet-published uploads map their future path to a local blob: URL. */
const overrides: Record<string, string> = {};
export const setAssetOverrides = (o: Record<string, string>) => Object.assign(overrides, o);

export const asset = (p: string) => overrides[p] ?? (/^(blob:|data:|https?:)/.test(p) ? p : `${BASE}${p}`);
