import { createMDX } from 'fumadocs-mdx/next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
};

const withMDX = createMDX({ configPath: 'source.config.ts' });

export default withMDX(config);