/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.waifu.im', 'api.waifu.pics', 'cdn.nekos.best'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
