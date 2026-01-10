/**
 * Security API Route
 * 
 * Manual endpoint to trigger security checks and send alerts if needed
 * Can be called via cron job or manual testing
 * 
 * @route GET /api/security
 */

import { NextRequest, NextResponse } from 'next/server';
import { runSecurityCheck } from '@/lib/security/secrets';
import { monitorAndAlertOnLeaks } from '@/lib/security/alerts';
import { securityApiParamsSchema } from '@/lib/security/schemas';
import { EmailProviderFactory } from '@/lib/email/providers';
import { env } from '@/env';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/security
 * 
 * Query params:
 * - secret: Optional secret token for authentication
 * - alert: Set to 'true' to send email alerts if issues found
 */
export async function GET(request: NextRequest) {
  try {
    // Validate query params with Zod
    const { searchParams } = request.nextUrl;
    const paramsResult = securityApiParamsSchema.safeParse({
      secret: searchParams.get('secret'),
      alert: searchParams.get('alert'),
    });

    if (!paramsResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid parameters',
          details: paramsResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { secret, alert: shouldAlert } = paramsResult.data;

    // Optional: Require authentication for this endpoint
    const expectedSecret = process.env.HASHNODE_REVALIDATE_WEBHOOK_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Run security check
    const securityCheck = runSecurityCheck();

    logger.info('Security check completed', {
      safe: securityCheck.safe,
      leaksDetected: securityCheck.leaks.detected,
      warningsCount: securityCheck.publicVarCheck.warnings.length,
    });

    // Send alert if requested and issues found
    if (shouldAlert && !securityCheck.safe) {
      const contactEmail = env.CONTACT_EMAIL;
      const fromEmail = env.RESEND_FROM_EMAIL || env.CONTACT_EMAIL;

      if (contactEmail && fromEmail) {
        try {
          const emailProvider = EmailProviderFactory.create();
          
          await monitorAndAlertOnLeaks(
            securityCheck,
            {
              alertEmail: contactEmail,
              fromEmail: fromEmail,
              provider: emailProvider,
            },
            {
              userAgent: request.headers.get('user-agent') || undefined,
              url: request.url,
            }
          );

          logger.info('Security alert email sent');
        } catch (error) {
          logger.error('Failed to send security alert', { error });
        }
      }
    }

    return NextResponse.json(
      {
        status: securityCheck.safe ? 'secure' : 'vulnerable',
        timestamp: new Date().toISOString(),
        details: {
          leaks: securityCheck.leaks,
          publicVarCheck: securityCheck.publicVarCheck,
        },
        alertSent: shouldAlert && !securityCheck.safe,
      },
      { 
        status: securityCheck.safe ? 200 : 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    logger.error('Security API error', { error });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
