/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@/components/ui"],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wallhaven.cc",
        port: "",
        pathname: "/api/v1/**",
      },
      {
        protocol: "https",
        hostname: "w.wallhaven.cc",
        port: "",
        pathname: "/full/**",
      },
      {
        protocol: "https",
        hostname: "th.wallhaven.cc",
        port: "",
        pathname: "/small/**",
      },
      {
        protocol: "https",
        hostname: "api.waifu.im",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.waifu.im",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "waifu.pics",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nekos.best",
        port: "",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "cdn.nekos.best",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.nekos.best",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeholder.pics",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.waifu.im",
      },
      {
        protocol: "https",
        hostname: "*.waifu.pics",
      },
      {
        protocol: "https",
        hostname: "*.nekos.best",
      },
      {
        protocol: "https",
        hostname: "*.wallhaven.cc",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Added from updates
    domains: ["cdn.waifu.im", "i.waifu.pics", "nekos.best", "wallhaven.cc", "w.wallhaven.cc"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      },
    }

    // Add support for importing SVGs as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    })

    // Optimize for production
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      }
    }

    return config
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    WALLHAVEN_API_KEY: process.env.WALLHAVEN_API_KEY,
    WAIFU_API_KEY: process.env.WAIFU_API_KEY,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ]
  },
  redirects: async () => {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/?tab=dashboard",
        permanent: true,
      },
      {
        source: "/download",
        destination: "/?tab=download",
        permanent: true,
      },
    ]
  },
  rewrites: async () => {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://api.waifu.im/:path*",
      },
    ]
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true, // Added from updates
  },
  typescript: {
    ignoreBuildErrors: true, // Added from updates
  },
}

module.exports = nextConfig
