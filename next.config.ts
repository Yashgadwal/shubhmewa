import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/review",
        destination: "/review.html",
      },
    ];
  },
};

export default nextConfig;
