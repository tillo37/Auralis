import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@auralis/shared-types'],
};

export default nextConfig;
