/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "api.waifu.im",
      "api.waifu.pics",
      "nekos.best",
      "wallhaven.cc",
      "femboyfinder.firestreaker2.gq",
      "cdn.waifu.im",
      "i.waifu.pics",
      "nekos.best",
      "w.wallhaven.cc",
      "th.wallhaven.cc",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

module.exports = nextConfig
