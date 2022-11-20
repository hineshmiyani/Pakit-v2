/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["jsx", "tsx"],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.pixabay.com"],
  },
};

module.exports = nextConfig;
