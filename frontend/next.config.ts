import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://finance-management-ncdf.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
