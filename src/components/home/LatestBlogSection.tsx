"use client";

/**
 * Latest Blog Section Component
 * Displays latest blog posts from Hashnode on home page with scroll animations
 * @module components/home/LatestBlogSection
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { BlogPost } from "@/lib/api/hashnode";
import { BlogCard } from "@/components/blog/BlogCard";
import { useEffect, useRef } from "react";

interface LatestBlogSectionProps {
  posts: readonly BlogPost[];
}

export function LatestBlogSection({ posts }: LatestBlogSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Dynamic import to reduce initial bundle size
    let ctx: any;
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          // Animate title
          gsap.from(".blog-title", {
            scrollTrigger: {
              trigger: ".blog-title",
              start: "top 80%",
              toggleActions: "play none none none",
            },
            opacity: 0.3,
            y: 20,
            duration: 0.4,
            ease: "power2.out",
          });

          // Animate cards with stagger
          gsap.from(".blog-card-animate", {
            scrollTrigger: {
              trigger: ".blog-grid",
              start: "top 75%",
              toggleActions: "play none none none",
            },
            opacity: 0.3,
            y: 20,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          });

          // Animate button
          gsap.from(".blog-cta", {
            scrollTrigger: {
              trigger: ".blog-cta",
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0.3,
            y: 20,
            duration: 0.4,
            ease: "power2.out",
          });
        }, sectionRef);
      });
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, [posts]);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="w-full bg-muted/20 py-4 md:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="blog-title">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="text-primary">L</span>atest Articles
          </h2>

          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Fresh takes, insights & deep dives ✨
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts available yet.</p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {posts.map((post) => (
                <div key={post.id} className="blog-card-animate">
                  <BlogCard
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    coverImage={post.coverImage}
                    publishedAt={post.publishedAt}
                    readTimeInMinutes={post.readTimeInMinutes}
                    author={post.author}
                    forceHorizontal={true}
                  />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="blog-cta text-center mt-14">
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">
                  View All Posts
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
