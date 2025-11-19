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

  // If you ever need images from external hosts, add here:
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
