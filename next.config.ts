import type { NextConfig } from 'next';

// Static export for GitHub Pages. BASE_PATH is "/<repo>" on Pages, empty locally.
const basePath = process.env.BASE_PATH || '';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default config;
