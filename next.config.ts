import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/Uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dcg000wo8wggwkskoks4g0s4.prod.sanctumcloud.com',
        pathname: '/Uploads/**', // Matches /Uploads and its subdirectories
      },
      {
        protocol: 'https',
        hostname: 'qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com',
        pathname: '/Uploads/**', // Matches /Uploads and its subdirectories, including /Uploads/images/
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;