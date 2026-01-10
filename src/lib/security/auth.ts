/**
 * Auth - Authentication Monitor
 * 
 * Monitors authentication attempts and detects suspicious behavior:
 * - Failed login attempts
 * - Account enumeration
 * - Session hijacking
 * - Brute force attacks
 * 
 * @module lib/security/auth
 */

import { logger } from '@/lib/logger';
import { type AuthEvent, validateAuthEvent } from './schemas';

export type { AuthEvent } from './schemas';

export interface AuthThreat {
  detected: boolean;
  threatType: 'brute-force' | 'account-enumeration' | 'suspicious-activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  identifier: string;
  eventCount: number;
  recommendation: string;
}

interface AuthAttempt {
  failures: number;
  lastAttempt: number;
  locked: boolean;
}

const authAttempts = new Map<string, AuthAttempt>();

// Configuration
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Clean up old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, attempt] of authAttempts.entries()) {
    if (attempt.lastAttempt + LOCKOUT_DURATION_MS < now) {
      authAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000); // Every 10 minutes

/**
 * Record authentication event
 */
export function recordAuthEvent(event: AuthEvent): AuthThreat | null {
  // Validate event with Zod
  const validation = validateAuthEvent(event);
  if (!validation.valid) {
    logger.error('Invalid auth event', { error: validation.error });
    return null;
  }

  const validatedEvent = validation.data!;
  const { identifier, eventType } = validatedEvent;
  const now = Date.now();
  
  let attempt = authAttempts.get(identifier);

  if (!attempt) {
    attempt = {
      failures: 0,
      lastAttempt: now,
      locked: false,
    };
  }

  // Reset if outside time window
  if (now - attempt.lastAttempt > ATTEMPT_WINDOW_MS) {
    attempt.failures = 0;
    attempt.locked = false;
  }

  attempt.lastAttempt = now;

  // Handle different event types
  if (eventType === 'login-failure') {
    attempt.failures++;

    logger.warn('Failed authentication attempt', {
      identifier,
      failures: attempt.failures,
    });

    // Check for brute force
    if (attempt.failures >= MAX_FAILED_ATTEMPTS) {
      attempt.locked = true;

      authAttempts.set(identifier, attempt);

      return {
        detected: true,
        threatType: 'brute-force',
        severity: 'high',
        description: `Brute force attack detected: ${attempt.failures} failed attempts`,
        identifier,
        eventCount: attempt.failures,
        recommendation: 'Account temporarily locked. Implement CAPTCHA or account lockout.',
      };
    }
  } else if (eventType === 'login-success') {
    // Reset on success
    attempt.failures = 0;
    attempt.locked = false;
  }

  authAttempts.set(identifier, attempt);
  return null;
}

/**
 * Check if identifier is locked out
 */
export function isLockedOut(identifier: string): boolean {
  const attempt = authAttempts.get(identifier);
  
  if (!attempt) return false;

  const now = Date.now();
  
  // Check if lockout expired
  if (attempt.locked && now - attempt.lastAttempt > LOCKOUT_DURATION_MS) {
    attempt.locked = false;
    attempt.failures = 0;
    authAttempts.set(identifier, attempt);
    return false;
  }

  return attempt.locked;
}

/**
 * Get remaining lockout time
 */
export function getLockoutTimeRemaining(identifier: string): number {
  const attempt = authAttempts.get(identifier);
  
  if (!attempt || !attempt.locked) return 0;

  const now = Date.now();
  const lockoutEnd = attempt.lastAttempt + LOCKOUT_DURATION_MS;
  
  return Math.max(0, lockoutEnd - now);
}

/**
 * Manually unlock an identifier
 */
export function unlockIdentifier(identifier: string): void {
  authAttempts.delete(identifier);
  logger.info('Identifier unlocked', { identifier });
}

/**
 * Get authentication monitoring stats
 */
export function getAuthStats(): {
  totalAttempts: number;
  lockedAccounts: number;
  failedAttempts: number;
} {
  let locked = 0;
  let failed = 0;

  for (const attempt of authAttempts.values()) {
    if (attempt.locked) locked++;
    if (attempt.failures > 0) failed++;
  }

  return {
    totalAttempts: authAttempts.size,
    lockedAccounts: locked,
    failedAttempts: failed,
  };
}
