import { getBlogPosts } from "@/lib/api/hashnode";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Revalidate sitemap every 5 minutes
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  
  // Fetch blog posts dynamically
  const posts = await getBlogPosts(100);

  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Extract unique tag pages from posts
  const tagSlugs = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      if (tag.slug) {
        tagSlugs.add(tag.slug);
      } else if (tag.name) {
        // Convert tag name to slug format
        const slugified = tag.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        if (slugified) {
          tagSlugs.add(slugified);
        }
      }
    });
  });

  const tagPages = Array.from(tagSlugs).map((slug) => ({
    url: `${baseUrl}/blog/tag/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/connect`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [
    ...staticPages,
    ...blogPosts,
    ...tagPages,
  ];
}

/* Sitemap Generation

1. Define the base URL from site configuration.
2. Fetch the latest 100 blog posts from Hashnode using getBlogPosts.
3. Map each blog post to a sitemap entry with URL, last modified date, change frequency, and priority.
4. Define static pages with their respective sitemap entries.
5. Combine static pages and blog post entries into a single sitemap array and return it.
*/