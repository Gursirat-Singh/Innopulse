import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable source maps in development to avoid parsing errors
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
