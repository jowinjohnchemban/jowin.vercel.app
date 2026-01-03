import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // This removes the "inferred workspace root" warning
    root: __dirname,
  },

  // Enable React 18's new SSR architecture
  // reactCompiler: true,

  // Recommended for Next.js 16
  reactStrictMode: true,

  // Aggressive performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error"], // Keep console.error in production for monitoring
    } : false,
  },

  // Aggressive caching and performance headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // Aggressive caching for instant loading
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // Static assets - cache forever
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/profile.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/site.webmanifest",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },

  // Optimized image configuration for instant loading
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    formats: ["image/webp"],
    qualities: [75, 85],
    // Enable image optimization for instant loading
    unoptimized: false,
  },

  // Allow dev server access from local network
  allowedDevOrigins: [
    "http://localhost:3000",
  ],

  // Enable compression for faster loading
  compress: true,

  // Optimize build output
  output: "standalone",
};

export default nextConfig;
