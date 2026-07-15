import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  webpack: (config: any) => {
    config.resolve.fallback = { ...config.resolve.fallback, "pino-pretty": false, "fsevents": false, "net": false, "tls": false };
    return config;
  },
};
export default nextConfig;
