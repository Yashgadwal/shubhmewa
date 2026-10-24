import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/review",
        destination: "/review.html",
        permanent: false,
      },
      {
        source: "/links",
        destination: "/links.html",
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
      {
        source: "/links",
        destination: "/links.html",
      },
    ];
  },
};

export default nextConfig;
