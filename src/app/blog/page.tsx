import { getBlogPosts } from "@/lib/api/hashnode";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "In-depth technical articles covering DevOps, cloud infrastructure, web development, React, Next.js, TypeScript, and modern software engineering practices.",
  keywords: [
    "DevOps blog",
    "Cloud infrastructure",
    "Web development tutorials",
    "React articles",
    "Next.js guides",
    "TypeScript tips",
    "Software engineering",
    "Technical writing",
  ],
  openGraph: {
    title: "Technical Blog - Jowin John Chemban",
    description: "Explore technical articles on modern web development, DevOps practices, and cloud architecture.",
    type: "website",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts(20);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
        {/* Header Section */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-28">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Blog</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Technical articles on DevOps, cloud infrastructure, web development, and engineering insights.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-6 md:gap-7 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  publishedAt={post.publishedAt}
                  readTimeInMinutes={post.readTimeInMinutes}
                  author={post.author}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
