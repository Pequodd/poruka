/** Prefixes a public path with the deploy base path (GitHub Pages serves the site from /<repo>/). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const asset = (p: string) => `${BASE}${p}`;
