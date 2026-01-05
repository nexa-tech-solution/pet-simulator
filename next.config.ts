import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Disable source maps in development to avoid Turbopack source map errors
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
