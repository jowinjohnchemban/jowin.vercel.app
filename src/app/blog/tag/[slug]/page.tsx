import { getBlogPosts } from "@/lib/api/hashnode";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const url = `${siteConfig.url}/blog/tag/${slug}`;
  const title = `Blog tagged "${tagName}"`;
  const description = `Browse all blog posts tagged with #${tagName}`;

  return {
    title,
    description,
    keywords: [tagName, "blog", "articles", siteConfig.author.name],
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title,
      description,
      creator: "@jowinchemban",
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch all posts and filter by tag
  const allPosts = await getBlogPosts(50);

  // Filter posts that have the matching tag
  const filteredPosts = allPosts.filter((post) =>
    post.tags?.some(
      (tag) =>
        tag.slug?.toLowerCase() === slug.toLowerCase() ||
        tag.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    )
  );

  // Format tag name for display
  const tagName =
    filteredPosts[0]?.tags?.find(
      (tag) =>
        tag.slug?.toLowerCase() === slug.toLowerCase() ||
        tag.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    )?.name ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
        {/* Header Section */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12">
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Blog <span className="text-primary">#{tagName}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {filteredPosts.length > 0
                ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "article" : "articles"} tagged with ${tagName} 📚`
                : `No articles found with tag "${tagName}"`}
            </p>
          </div>
        </section>

        {/* Blog Posts Grid or Empty State */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 space-y-6">
              <p className="text-lg text-muted-foreground">
                Oops! No posts with <span className="font-semibold text-foreground">#{tagName}</span> 🤷‍♂️
              </p>
              <Button asChild size="lg">
                <Link href="/blog">Explore ✨</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-6 md:gap-7 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
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
