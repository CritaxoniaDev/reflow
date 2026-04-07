import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
  generateBuildId: async () => {
    const chars = 'abcdefghijk0123456789-~';

    return Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;