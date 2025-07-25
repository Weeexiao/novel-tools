import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: isDev ? undefined : 'export',
  basePath: isDev ? '' : '/novel-tools',
  assetPrefix: isDev ? '' : '/novel-tools/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
