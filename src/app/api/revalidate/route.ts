/**
 * On-Demand Revalidation API Route
 * Triggers instant cache revalidation when Hashnode content changes
 * 
 * Usage: Configure this as a webhook in your Hashnode publication settings
 * URL: https://yourdomain.com/api/revalidate
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Security: Validate webhook requests
const REVALIDATE_SECRET = process.env.HASHNODE_REVALIDATE_WEBHOOK_SECRET || '';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RevalidateRequestBody {
  secret?: string;
  path?: string;
  slug?: string;
  type?: 'post' | 'tag' | 'all';
}

/**
 * POST /api/revalidate
 * 
 * Body examples:
 * - Revalidate specific post: { "secret": "xxx", "slug": "my-post", "type": "post" }
 * - Revalidate all blog pages: { "secret": "xxx", "type": "all" }
 * - Revalidate specific path: { "secret": "xxx", "path": "/blog" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RevalidateRequestBody;
    
    // Security check: Validate secret token
    if (!REVALIDATE_SECRET || body.secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { 
          error: 'Invalid secret token',
          message: 'Set HASHNODE_REVALIDATE_WEBHOOK_SECRET environment variable and provide it in the request'
        },
        { status: 401 }
      );
    }

    // Handle different revalidation types
    const pathsRevalidated: string[] = [];

    if (body.type === 'all') {
      // Revalidate all blog-related pages
      await revalidatePath('/', 'layout');
      await revalidatePath('/blog', 'layout');
      pathsRevalidated.push('/', '/blog', '/blog/[slug]', '/blog/tag/[slug]');
    } else if (body.type === 'post' && body.slug) {
      // Revalidate specific blog post
      await revalidatePath(`/blog/${body.slug}`);
      await revalidatePath('/blog');
      await revalidatePath('/');
      pathsRevalidated.push(`/blog/${body.slug}`, '/blog', '/');
    } else if (body.type === 'tag' && body.slug) {
      // Revalidate specific tag page
      await revalidatePath(`/blog/tag/${body.slug}`);
      await revalidatePath('/blog');
      pathsRevalidated.push(`/blog/tag/${body.slug}`, '/blog');
    } else if (body.path) {
      // Revalidate specific path
      await revalidatePath(body.path);
      pathsRevalidated.push(body.path);
    } else {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          message: 'Provide either "type" (all/post/tag) with optional "slug", or "path"'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      paths: pathsRevalidated,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/revalidate?secret=xxx&slug=my-post&type=post
 * Alternative GET endpoint for easier webhook configuration
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const path = searchParams.get('path');
  const type = searchParams.get('type') as 'post' | 'tag' | 'all' | null;

  // Security check
  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid or missing secret token' },
      { status: 401 }
    );
  }

  try {
    const pathsRevalidated: string[] = [];

    if (type === 'all') {
      await revalidatePath('/', 'layout');
      await revalidatePath('/blog', 'layout');
      pathsRevalidated.push('/', '/blog', '/blog/[slug]', '/blog/tag/[slug]');
    } else if (type === 'post' && slug) {
      await revalidatePath(`/blog/${slug}`);
      await revalidatePath('/blog');
      await revalidatePath('/');
      pathsRevalidated.push(`/blog/${slug}`, '/blog', '/');
    } else if (type === 'tag' && slug) {
      await revalidatePath(`/blog/tag/${slug}`);
      await revalidatePath('/blog');
      pathsRevalidated.push(`/blog/tag/${slug}`, '/blog');
    } else if (path) {
      await revalidatePath(path);
      pathsRevalidated.push(path);
    } else {
      return NextResponse.json(
        { error: 'Provide type (all/post/tag) with optional slug, or path' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      paths: pathsRevalidated,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
