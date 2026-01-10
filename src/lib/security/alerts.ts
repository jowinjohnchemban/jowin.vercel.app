/**
 * Alerts - Security Alert Service
 * 
 * Handles sending security alert emails when secrets are leaked
 * 
 * @module lib/security/alerts
 */

import { logger } from '@/lib/logger';
import { generateSecurityAlertHTML, generateSecurityAlertText } from '@/lib/email/templates/security';
import type { SecretLeakDetection } from './secrets';
import type { EmailProvider } from '@/lib/email/providers/base';

export interface SecurityAlertServiceOptions {
  alertEmail: string;
  fromEmail: string;
  provider: EmailProvider;
}

/**
 * Send security alert email
 */
export async function sendSecurityAlert(
  leaks: SecretLeakDetection,
  warnings: string[],
  options: SecurityAlertServiceOptions,
  metadata?: {
    userAgent?: string;
    url?: string;
  }
): Promise<{ success: boolean; error?: string; emailId?: string }> {
  try {
    const timestamp = new Date().toISOString();

    const emailData = {
      leaks,
      warnings,
      timestamp,
      ...metadata,
    };

    const htmlContent = generateSecurityAlertHTML(emailData);
    const textContent = generateSecurityAlertText(emailData);

    // Send email using the provided email provider
    const result = await options.provider.send({
      from: options.fromEmail,
      to: options.alertEmail,
      subject: '🚨 SECURITY ALERT: Environment Secret Leak Detected',
      html: htmlContent,
    });

    if (result.success) {
      logger.info('Security alert email sent successfully', {
        messageId: result.messageId,
        to: options.alertEmail,
      });
      return {
        success: true,
        emailId: result.messageId,
      };
    } else {
      logger.error('Failed to send security alert email', {
        error: result.error,
      });
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error sending security alert email', { error: errorMessage });
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Check for leaks and send alert if detected (server-side only)
 */
export async function monitorAndAlertOnLeaks(
  securityCheck: {
    safe: boolean;
    leaks: SecretLeakDetection;
    publicVarCheck: { valid: boolean; warnings: string[] };
  },
  options: SecurityAlertServiceOptions,
  metadata?: {
    userAgent?: string;
    url?: string;
  }
): Promise<void> {
  // Only run on server
  if (typeof window !== 'undefined') {
    return;
  }

  if (!securityCheck.safe) {
    logger.error('🚨 Security check failed, sending alert email', {
      leaks: securityCheck.leaks.leakedSecrets,
      warnings: securityCheck.publicVarCheck.warnings,
    });

    await sendSecurityAlert(
      securityCheck.leaks,
      securityCheck.publicVarCheck.warnings,
      options,
      metadata
    );
  }
}
