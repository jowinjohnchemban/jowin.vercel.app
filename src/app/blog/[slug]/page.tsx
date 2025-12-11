import { getBlogPostBySlug, getBlogPosts } from "@/lib/api/hashnode";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { BlogPostCover } from "@/components/blog/BlogPostCover";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { BlogPostTags } from "@/components/blog/BlogPostTags";

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

  const publishedDate = new Date(post.publishedAt).toISOString();
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.map((tag) => tag.name) || [],
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: publishedDate,
      authors: [post.author.name],
      images: post.coverImage?.url
        ? [
            {
              url: post.coverImage.url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      tags: post.tags?.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage?.url ? [post.coverImage.url] : [],
      creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@jowinjc",
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(20);
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
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
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

          <BlogPostHeader
            title={post.title}
            publishedAt={post.publishedAt}
            readTimeInMinutes={post.readTimeInMinutes}
          />

          <BlogPostContent content={post.content} />

          <BlogPostTags tags={post.tags} />
        </article>
      </main>
      <Footer />
    </>
  );
}
