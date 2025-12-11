/**
 * Hashnode API facade
 * @module lib/api/hashnode
 */

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
 * Fetch blog posts from Hashnode
 * @param count - Number of posts to fetch
 * @returns Array of blog posts or empty array on error
 */
export async function getBlogPosts(count?: number): Promise<BlogPost[]> {
  try {
    return await hashnodeService.getBlogPosts(count);
  } catch {
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 * @param slug - Blog post slug
 * @returns Blog post or null if not found/error
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    return await hashnodeService.getBlogPostBySlug(slug);
  } catch {
    return null;
  }
}
