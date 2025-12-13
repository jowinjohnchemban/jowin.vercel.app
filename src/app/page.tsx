// src/app/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroSection, LatestBlogSection, ContactSection } from "@/components/home";
import { getBlogPosts } from "@/lib/api/hashnode";
import { generatePageSEO } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { getBlurDataURL } from "@/lib/placeholder";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageSEO(undefined, {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "Full Stack",
    "DevOps",
    "Cloud",
    "Infrastructure",
    "Software",
    "Development",
    "Portfolio",
    siteConfig.author.name,
  ],
  openGraph: {
    title: `${siteConfig.name} - Full Stack Developer & DevOps Engineer`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
});

export default async function Home() {
  // Fetch blog posts on the server
  const latestPosts = await getBlogPosts(3);

  // Generate blur placeholder for hero image
  const profilePath = path.join(process.cwd(), "public", "profile.jpg");
  let heroBlurDataURL: string | undefined;
  try {
    if (fs.existsSync(profilePath)) {
      const buffer = fs.readFileSync(profilePath);
      heroBlurDataURL = await getBlurDataURL(buffer);
    }
  } catch (error) {
    console.warn("Failed to generate blur placeholder for hero image:", error);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-background text-foreground">
        <HeroSection blurDataURL={heroBlurDataURL} />
        <LatestBlogSection posts={latestPosts} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
