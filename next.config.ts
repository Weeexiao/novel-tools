import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/novel-tools',
  assetPrefix: '/novel-tools/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
