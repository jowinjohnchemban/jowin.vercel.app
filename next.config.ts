import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // This removes the "inferred workspace root" warning
    root: __dirname,
  },

  // Enable React 18's new SSR architecture
  reactCompiler: true,

  // Recommended for Next.js 16
  reactStrictMode: true,

  // (Optional) Useful for debugging GSAP animations
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error"], // Keep console.error in production for monitoring
    } : false,
  },

  // Security and performance headers
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
    ];
  },

  // Allow images from external hosts
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
  },

  // Allow dev server access from local network
  allowedDevOrigins: [
    "http://localhost:3000",
  ],
};

export default nextConfig;
