/**
 * Hashnode API Integration Module
 * 
 * **Standalone Adapter/Handler** for Hashnode GraphQL API.
 * This module encapsulates all Hashnode-specific logic and can be replaced
 * with another blogging platform adapter without affecting consuming code.
 * 
 * @module lib/api/hashnode
 * @see {@link ./README.md} for detailed architecture documentation
 * 
 * @example Basic Usage
 * ```typescript
 * import { getBlogPosts, getBlogPostBySlug } from '@/lib/api/hashnode';
 * 
 * const posts = await getBlogPosts(10);
 * const post = await getBlogPostBySlug('my-post-slug');
 * ```
 * 
 * @architecture
 * - Facade Pattern: Simplified API for consumers
 * - Service Layer: Business logic encapsulation
 * - Repository Pattern: Data access abstraction
 * - Data Cache: Aggressive caching with unstable_cache for native speed
 */

import { unstable_cache } from 'next/cache';

export * from './types';
export * from './config';
export { HashnodeService, hashnodeService } from './service';

/**
 * Convenience functions using the singleton service
 */
import { hashnodeService } from './service';
import type { BlogPost, BlogPostDetail, Publication } from './types';

/**
 * Fetch publication details
 * @returns Publication details or null on error
 */
export async function getPublication(): Promise<Publication | null> {
  try {
    return await hashnodeService.getPublication();
  } catch {
    return null;
  }
}

/**
 * Fetch blog posts from Hashnode with aggressive caching
 * @param count - Number of posts to fetch
 * @returns Array of blog posts or empty array on error
 * 
 * Note: Uses Next.js unstable_cache for Data Cache with 5-minute revalidation.
 * This provides native Next.js speed by caching at multiple levels:
 * 1. Data Cache: unstable_cache (5 min)
 * 2. Full Route Cache: ISR revalidate (5 min)
 * 3. On-demand: Webhook revalidation for instant updates
 */
export async function getBlogPosts(count?: number): Promise<readonly BlogPost[]> {
  const cacheKey = `blog-posts-${count || 'all'}`;
  
  const getCachedPosts = unstable_cache(
    async () => {
      try {
        return await hashnodeService.getBlogPosts(count);
      } catch {
        return [];
      }
    },
    [cacheKey],
    {
      revalidate: 300, // 5 minutes
      tags: ['blog-posts', cacheKey],
    }
  );

  return getCachedPosts();
}

/**
 * Fetch a single blog post by slug with aggressive caching
 * @param slug - Blog post slug
 * @returns Blog post or null if not found/error
 * 
 * Note: Uses Next.js unstable_cache for Data Cache with 5-minute revalidation.
 * Cached per slug for optimal performance.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const cacheKey = `blog-post-${slug}`;
  
  const getCachedPost = unstable_cache(
    async () => {
      try {
        return await hashnodeService.getBlogPostBySlug(slug);
      } catch {
        return null;
      }
    },
    [cacheKey],
    {
      revalidate: 300, // 5 minutes
      tags: ['blog-posts', cacheKey, `slug-${slug}`],
    }
  );

  return getCachedPost();
}
