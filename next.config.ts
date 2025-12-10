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

  // Allow images from external hosts
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
  },
};

export default nextConfig;
