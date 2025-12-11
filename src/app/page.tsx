"use client";

// src/app/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroSection, LatestBlogSection, ContactSection } from "@/components/home";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-background text-foreground">
        <HeroSection />
        <LatestBlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
