import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable the development indicator (bottom-left "Next.js" badge)

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Specify the port if needed
        pathname: '/uploads/**', // Adjust the pathname to match your uploads directory
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // Add any other config options here
};

export default nextConfig;
