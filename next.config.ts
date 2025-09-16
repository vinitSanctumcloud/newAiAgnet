import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable the development indicator (bottom-left "Next.js" badge)
  devIndicators: {
    buildActivity: false,
  },

  // Add any other config options here
};

export default nextConfig;
