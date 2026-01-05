import { getBlogPostBySlug, getBlogPosts } from "@/lib/api/hashnode";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { BlogPostCover } from "@/components/blog/BlogPostCover";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { BlogPostTags } from "@/components/blog/BlogPostTags";
import { BlogPostNavigation } from "@/components/blog/BlogPostNavigation";
import { BlogBreadcrumb } from "@/components/blog/BlogBreadcrumb";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const url = `${siteConfig.url}/blog/${slug}`;
  const keywords = post.tags?.map((tag) => tag.name) || [];

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...keywords, "blog", "article", siteConfig.author.name],
    authors: post.author ? [{ name: post.author.name }] : [{ name: siteConfig.author.name }],
    openGraph: {
      type: "article",
      locale: "en_US",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: siteConfig.name,
      publishedTime: post.publishedAt,
      images: post.coverImage?.url
        ? [
            {
              url: post.coverImage.url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      authors: post.author ? [post.author.name] : [siteConfig.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@jowinchemban",
      images: post.coverImage?.url ? [post.coverImage.url] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

// ISR: Static generation with revalidation every 300 seconds (5 minutes)
// Combined with on-demand revalidation via webhooks for instant updates
export const revalidate = 300;

/**
 * Generate static params for all blog posts
 * Generates routes for up to 50 most recent posts at build time
 */
export async function generateStaticParams() {
  const posts = await getBlogPosts(50);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Fetch post and navigation posts in parallel for better performance
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(50)
  ]);

  if (!post) {
    notFound();
  }

  // Get navigation posts
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || siteConfig.author.name,
      image: post.author?.profilePicture,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section with Cover Image */}
        {post.coverImage?.url && (
          <BlogPostCover url={post.coverImage.url} alt={post.title} />
        )}

        {/* Article Content */}
        <article 
          className="mx-auto flex max-w-3xl flex-col items-stretch gap-10 px-5 py-10"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <meta itemProp="headline" content={post.title} />
          <meta itemProp="description" content={post.excerpt} />
          <meta itemProp="datePublished" content={post.publishedAt} />
          <meta itemProp="author" content={post.author.name} />
          {post.coverImage?.url && (
            <meta itemProp="image" content={post.coverImage.url} />
          )}

          <BlogBreadcrumb currentTitle={post.title} currentSlug={slug} />

          <BlogPostHeader
            title={post.title}
            publishedAt={post.publishedAt}
            readTimeInMinutes={post.readTimeInMinutes}
            authorName={post.author.name}
            slug={slug}
          />

          <BlogPostContent content={post.content} />

          <BlogPostTags tags={post.tags} />

          <BlogPostNavigation
            previousPost={
              previousPost
                ? { slug: previousPost.slug, title: previousPost.title }
                : null
            }
            nextPost={
              nextPost
                ? { slug: nextPost.slug, title: nextPost.title }
                : null
            }
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
