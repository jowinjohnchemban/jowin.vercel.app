// src/app/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroSection, LatestBlogSection, ContactSection } from "@/components/home";
import { getBlogPosts } from "@/lib/api/hashnode";

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
