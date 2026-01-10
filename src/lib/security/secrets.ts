/**
 * Secrets - Runtime Secret Leak Detection
 * 
 * Monitors for environment secret leaks at runtime and sends email alerts.
 * Checks if server-only secrets are exposed to the client bundle.
 * 
 * @module lib/security/secrets
 */

import { logger } from '@/lib/logger';

/**
 * Server-only secrets that should NEVER be exposed to client
 */
const SERVER_ONLY_SECRETS = [
  'HASHNODE_API_KEY',
  'RESEND_API_KEY',
  'SMTP_PASS',
  'HASHNODE_REVALIDATE_WEBHOOK_SECRET',
  'IPINFO_TOKEN',
  'CONTACT_EMAIL',
  'RESEND_FROM_EMAIL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
] as const;

export interface SecretLeakDetection {
  detected: boolean;
  leakedSecrets: string[];
  timestamp: string;
  environment: 'client' | 'server';
}

/**
 * Check if any server secrets are leaked to the client bundle
 * Only runs on client-side to detect leaks
 * Ignores NEXT_PUBLIC_* variables as they are intentionally client-safe
 */
export function detectSecretLeaks(): SecretLeakDetection {
  const leakedSecrets: string[] = [];
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    return {
      detected: false,
      leakedSecrets: [],
      timestamp: new Date().toISOString(),
      environment: 'server',
    };
  }

  // Check if any server-only secrets are accessible on client
  for (const secret of SERVER_ONLY_SECRETS) {
    // Check process.env (should not be accessible on client for server secrets)
    if (typeof process !== 'undefined' && process.env && process.env[secret]) {
      leakedSecrets.push(secret);
      logger.error(`🚨 SECURITY: Secret leaked to client: ${secret}`);
    }
  }

  // Also check for any non-NEXT_PUBLIC environment variables on the client
  // (they should never be accessible on client-side)
  if (typeof process !== 'undefined' && process.env) {
    for (const key of Object.keys(process.env)) {
      // Skip NEXT_PUBLIC_* variables - they're intentionally client-safe
      if (key.startsWith('NEXT_PUBLIC_')) {
        continue;
      }
      // Skip variables we already checked
      if (SERVER_ONLY_SECRETS.includes(key as any)) {
        continue;
      }
      // Skip system variables
      if (key === 'NODE_ENV' || key === 'PATH' || key.startsWith('npm_')) {
        continue;
      }
      // Any other variable present on client is a potential leak
      if (process.env[key] && !leakedSecrets.includes(key)) {
        leakedSecrets.push(key);
        logger.error(`🚨 SECURITY: Unexpected env variable on client: ${key}`);
      }
    }
  }

  const detected = leakedSecrets.length > 0;

  if (detected) {
    logger.error('🚨 SECURITY BREACH: Server secrets detected on client!', {
      leakedSecrets,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    detected,
    leakedSecrets,
    timestamp: new Date().toISOString(),
    environment: 'client',
  };
}

/**
 * Validate that NEXT_PUBLIC_* variables don't contain sensitive data
 * Checks for common patterns that indicate secrets
 */
export function validatePublicVariables(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    return { valid: true, warnings: [] };
  }

  const suspiciousPatterns = [
    { pattern: /api[_-]?key/i, message: 'API key pattern detected in public variable' },
    { pattern: /secret/i, message: 'Secret pattern detected in public variable' },
    { pattern: /password/i, message: 'Password pattern detected in public variable' },
    { pattern: /token/i, message: 'Token pattern detected in public variable' },
    { pattern: /private[_-]?key/i, message: 'Private key pattern detected in public variable' },
  ];

  // Check all NEXT_PUBLIC_* variables
  if (typeof process !== 'undefined' && process.env) {
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith('NEXT_PUBLIC_') && value) {
        for (const { pattern, message } of suspiciousPatterns) {
          if (pattern.test(key) || pattern.test(value)) {
            warnings.push(`${message}: ${key}`);
            logger.warn(`⚠️ SECURITY WARNING: ${message} in ${key}`);
          }
        }
      }
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Run comprehensive security check
 */
export function runSecurityCheck(): {
  safe: boolean;
  leaks: SecretLeakDetection;
  publicVarCheck: { valid: boolean; warnings: string[] };
} {
  const leaks = detectSecretLeaks();
  const publicVarCheck = validatePublicVariables();

  const safe = !leaks.detected && publicVarCheck.valid;

  if (!safe) {
    logger.error('🚨 SECURITY CHECK FAILED', {
      leaks,
      publicVarCheck,
    });
  }

  return {
    safe,
    leaks,
    publicVarCheck,
  };
}
