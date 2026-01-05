/**
 * On-Demand Revalidation API Route
 * Triggers instant cache revalidation when Hashnode content changes
 * 
 * Supports two modes:
 * 1. Hashnode webhooks (signature verification via x-hashnode-signature header)
 * 2. Manual triggers (secret token in body/query)
 * 
 * Usage: Configure this as a webhook in your Hashnode publication settings
 * URL: https://yourdomain.com/api/revalidate
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

interface HashnodeWebhookBody {
  metadata?: {
    uuid?: string;
  };
  data?: {
    publication?: {
      id?: string;
    };
    post?: {
      id?: string;
      slug?: string;
    };
    staticPage?: {
      id?: string;
      slug?: string;
    };
    eventType?: string;
  };
}

/**
 * Verify Hashnode webhook signature
 */
function verifyHashnodeSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  try {
    // Parse signature header: t=timestamp,v1=signature
    const parts = signature.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
    const sig = parts.find(p => p.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !sig) return false;

    // Create expected signature
    const payload = `${timestamp}.${body}`;
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(sig),
      Buffer.from(expectedSig)
    );
  } catch {
    return false;
  }
}

/**
 * POST /api/revalidate
 * 
 * Body examples:
 * - Manual: { "secret": "xxx", "slug": "my-post", "type": "post" }
 * - Hashnode: Uses x-hashnode-signature header for verification
 */
export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText) as RevalidateRequestBody & HashnodeWebhookBody;
    
    const hashnodeSignature = request.headers.get('x-hashnode-signature');
    const isHashnodeWebhook = !!hashnodeSignature;

    // Security check: Verify Hashnode webhook signature or manual secret token
    if (isHashnodeWebhook) {
      if (!verifyHashnodeSignature(bodyText, hashnodeSignature, REVALIDATE_SECRET)) {
        return NextResponse.json(
          { 
            error: 'Invalid webhook signature',
            message: 'Hashnode webhook signature verification failed'
          },
          { status: 401 }
        );
      }
    } else {
      // Manual trigger - check secret in body
      if (!REVALIDATE_SECRET || body.secret !== REVALIDATE_SECRET) {
        return NextResponse.json(
          { 
            error: 'Invalid secret token',
            message: 'Set HASHNODE_REVALIDATE_WEBHOOK_SECRET environment variable and provide it in the request'
          },
          { status: 401 }
        );
      }
    }

    // Handle different revalidation types
    const pathsRevalidated: string[] = [];

    if (isHashnodeWebhook && body.data) {
      // Handle Hashnode webhook events
      const eventType = body.data.eventType;
      const postSlug = body.data.post?.slug;

      if (eventType?.includes('post') && postSlug) {
        // Post published/updated/deleted - revalidate specific paths
        await revalidatePath(`/blog/${postSlug}`);
        await revalidatePath('/blog');
        await revalidatePath('/');
        pathsRevalidated.push(`/blog/${postSlug}`, '/blog', '/');
      } else {
        // Other events - revalidate all
        await revalidatePath('/', 'layout');
        await revalidatePath('/blog', 'layout');
        pathsRevalidated.push('/', '/blog', '/blog/[slug]', '/blog/tag/[slug]');
      }
    } else if (body.type === 'all') {
      // Manual: Revalidate all blog-related pages
      await revalidatePath('/', 'layout');
      await revalidatePath('/blog', 'layout');
      pathsRevalidated.push('/', '/blog', '/blog/[slug]', '/blog/tag/[slug]');
    } else if (body.type === 'post' && body.slug) {
      // Manual: Revalidate specific blog post
      await revalidatePath(`/blog/${body.slug}`);
      await revalidatePath('/blog');
      await revalidatePath('/');
      pathsRevalidated.push(`/blog/${body.slug}`, '/blog', '/');
    } else if (body.type === 'tag' && body.slug) {
      // Manual: Revalidate specific tag page
      await revalidatePath(`/blog/tag/${body.slug}`);
      await revalidatePath('/blog');
      pathsRevalidated.push(`/blog/tag/${body.slug}`, '/blog');
    } else if (body.path) {
      // Manual: Revalidate specific path
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
      source: isHashnodeWebhook ? 'hashnode-webhook' : 'manual',
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
