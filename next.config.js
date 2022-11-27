/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["jsx", "tsx"],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.pixabay.com", "safe-transaction-assets.safe.global"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
