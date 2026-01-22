import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hel1.your-objectstorage.com',
        pathname: '/pics/**',
      },
    ],
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
