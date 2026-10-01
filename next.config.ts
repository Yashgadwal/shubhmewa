import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/review",
        destination: "/review.html",
        permanent: false,
      },
    ];
  },
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
