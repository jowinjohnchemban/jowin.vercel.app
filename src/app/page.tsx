// src/app/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroSection, LatestBlogSection, ContactSection } from "@/components/home";
import { getBlogPosts } from "@/lib/api/hashnode";
import { generatePageSEO } from "@/config/seo";
import { siteConfig } from "@/config/site";
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-background text-foreground">
        <HeroSection />
        <LatestBlogSection posts={latestPosts} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
