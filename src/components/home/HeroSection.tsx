"use client";

/**
 * Hero Section Component
 * Landing page hero with GSAP animations
 * SEO-friendly: Content visible by default, enhanced with subtle animation
 * @module components/home/HeroSection
 */

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!heroRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const elements = heroRef.current.querySelectorAll(".hero-fade");

    // Set initial state and animate in one go
    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all", // Remove inline styles after animation
      }
    );
  });

  return (
    <section
      ref={heroRef}
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-0 min-h-[calc(100vh-4rem)] flex flex-col-reverse lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-12"
    >
      {/* LEFT */}
      <div className="flex-1 space-y-6 text-center lg:text-left hero-fade max-w-xl mx-auto lg:mx-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Hi, I&apos;m <span className="text-primary">Jowin</span>
        </h1>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Full-Stack Coder & IT Engineer
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground">
          Creating solutions, designing systems & crafting experiences that inspire ⚡
          Always learning, building, exploring & growing 🚀
        </p>

        <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/blog">Read Blog 📝</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href="/connect">Let&apos;s Connect 💬</Link>
          </Button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex justify-center hero-fade">
        <Image
          src="/profile.jpg"
          alt="Jowin John Chemban"
          width={300}
          height={300}
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl shadow-2xl object-cover"
          priority
        />
      </div>
    </section>
  );
}
