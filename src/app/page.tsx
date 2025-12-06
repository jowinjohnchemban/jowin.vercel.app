// src/app/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* --------------------------- TYPE DEFINITION --------------------------- */
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
}

/* --------------------------- HERO SECTION --------------------------- */
function HeroSection() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const elements = heroRef.current.querySelectorAll(".hero-fade");

    gsap.from(elements, {
      opacity: 0,
      y: 30,
      duration: 1.1,
      stagger: 0.22,
      ease: "power3.out",
    });
  }, []);

  return (
    <>
    <section
      ref={heroRef}
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col-reverse lg:flex-row items-center justify-between gap-12"
    >
      {/* LEFT */}
      <div className="flex-1 space-y-6 text-center lg:text-left hero-fade max-w-xl mx-auto lg:mx-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Hi, I&apos;m <span className="text-primary">Jowin</span>
        </h1>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          IT DevOps Engineer
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground">
          I build lightweight infrastructure tools, cloud deployments, and
          modern web apps. This portfolio is built with Next.js, Tailwind,
          shadcn/ui, and blog content from Payload CMS.
        </p>

        <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="#projects">View Projects</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href="/blog">Read Blog</Link>
          </Button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex justify-center hero-fade">
        <Image
          src="/profile.jpg"
          alt="Profile"
          width={300}
          height={300}
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl shadow-2xl object-cover"
        />
      </div>
    </section>
    </>
  );
}

/* --------------------------- BLOG SECTION --------------------------- */
const PLACEHOLDER_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "Securing Nginx with TLS and Let's Encrypt",
    excerpt:
      "A step-by-step guide for deploying secure SSL certificates on your Nginx server.",
    slug: "nginx-tls-letsencrypt",
  },
  {
    id: "2",
    title: "The Power of Next.js Server Components",
    excerpt:
      "Understanding the new RSC paradigm and how it optimizes performance.",
    slug: "nextjs-server-components",
  },
  {
    id: "3",
    title: "Building CI/CD Pipelines with GitHub Actions",
    excerpt:
      "Automate deployments using clean and scalable GitHub Actions workflows.",
    slug: "github-actions-ci-cd",
  },
];

function BlogSection() {
  const latestBlogs = PLACEHOLDER_BLOGS;

  return (
    <section
      id="blog"
      className="w-full bg-muted/20 py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="text-primary">L</span>atest Insights
        </h2>

        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          Snippets from my latest posts on server engineering, cloud
          infrastructure, and modern web development practices.
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestBlogs.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="grow">
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  variant="link"
                  className="p-0 text-primary font-medium hover:text-primary/80"
                >
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog">
              View All Posts
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- MAIN PAGE --------------------------- */
export default function Home() {
  return (
    <>
      <Navbar />
        <main className="min-h-screen w-full bg-background text-foreground">
          <HeroSection />
          <BlogSection />
        </main>
      <Footer />
    </>
  );
}
