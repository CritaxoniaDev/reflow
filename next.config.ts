import type { NextConfig } from "next";

const generateDeploymentId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const random = Array.from({ length: 28 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');

  return `dpl_${random}`;
};

const nextConfig: NextConfig = {
  devIndicators: false,
  deploymentId: generateDeploymentId(),
  generateBuildId: async () => {
    const chars = 'abcdefghijk0123456789-~';

    return Array.from({ length: 20 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;