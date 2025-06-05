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
  images: {
    domains: ["images.unsplash.com"],
  },
  async rewrites() {
    const rules = [];

    if (process.env.NODE_ENV === "development") {
      rules.push({
        source: "/api/v1/:path*",
        destination: "http://localhost:5000/api/v1/:path*",
      });
    }
    rules.push({
      source: "/api/:path*",
      destination: "https://finance-management-ncdf.onrender.com/api/:path*",
    });

    return rules;
  },
};

export default nextConfig;
