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
    // optimizePackageImports: ["lucide-react"],
  },

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error"], // Keep console.error in production for monitoring
    } : false,
  },

  // Allow images from external hosts
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
  },

  // Allow dev server access from local network
  allowedDevOrigins: [
    "http://localhost:3000",
  ],
};

export default nextConfig;
