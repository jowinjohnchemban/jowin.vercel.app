"use client";

/**
 * Latest Blog Section Component
 * Displays latest blog posts from Hashnode on home page
 * @module components/home/LatestBlogSection
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getBlogPosts } from "@/lib/api/hashnode";
import type { BlogPost } from "@/lib/api/hashnode";
import { BlogCard } from "@/components/blog/BlogCard";

export function LatestBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts(3).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <section
      id="blog"
      className="w-full bg-muted/20 py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="text-primary">L</span>atest Articles
        </h2>

        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Dive into the insights and articles on my blog.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts available yet.</p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
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
                  forceHorizontal={true}
                />
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
          </>
        )}
      </div>
    </section>
  );
}
