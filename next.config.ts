import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/orthese-site" : "",
  assetPrefix: isProd ? "/orthese-site/" : "",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
