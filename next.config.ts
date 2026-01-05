import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimisticClientCache: false,
    ppr: false,
    serverComponentsExternalPackages: [],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
