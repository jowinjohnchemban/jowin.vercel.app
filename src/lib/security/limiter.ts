/**
 * Limiter - Rate Limiting
 * 
 * In-memory rate limiting for API endpoints and form submissions
 * Detects and blocks brute force attempts
 * 
 * @module lib/security/limiter
 */

import { logger } from '@/lib/logger';
import { type RateLimitConfig, validateRateLimitConfig } from './schemas';

export type { RateLimitConfig } from './schemas';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  blocked: boolean;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
  blocked: boolean;
}

/**
 * In-memory store for rate limiting
 * In production, use Redis or similar distributed cache
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  // Validate config with Zod
  const validation = validateRateLimitConfig(config);
  if (!validation.valid) {
    logger.error('Invalid rate limit config', { error: validation.error });
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
      blocked: true,
    };
  }

  const validatedConfig = validation.data!;
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);

  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + validatedConfig.windowMs,
      blocked: false,
    };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > validatedConfig.maxRequests) {
    entry.blocked = true;
    logger.warn('Rate limit exceeded', {
      identifier,
      count: entry.count,
      limit: validatedConfig.maxRequests,
    });
  }

  rateLimitStore.set(key, entry);

  return {
    allowed: !entry.blocked,
    remaining: Math.max(0, validatedConfig.maxRequests - entry.count),
    resetAt: new Date(entry.resetAt),
    blocked: entry.blocked,
  };
}

/**
 * Block an identifier temporarily (e.g., after suspicious activity)
 */
export function blockIdentifier(
  identifier: string,
  durationMs: number = 60 * 60 * 1000 // 1 hour default
): void {
  const key = `ratelimit:${identifier}`;
  rateLimitStore.set(key, {
    count: Number.MAX_SAFE_INTEGER,
    resetAt: Date.now() + durationMs,
    blocked: true,
  });

  logger.warn('Identifier blocked', {
    identifier,
    durationMs,
  });
}

/**
 * Check if identifier is blocked
 */
export function isBlocked(identifier: string): boolean {
  const key = `ratelimit:${identifier}`;
  const entry = rateLimitStore.get(key);
  
  if (!entry) return false;
  
  const now = Date.now();
  if (entry.resetAt < now) {
    rateLimitStore.delete(key);
    return false;
  }

  return entry.blocked;
}

/**
 * Unblock an identifier
 */
export function unblockIdentifier(identifier: string): void {
  const key = `ratelimit:${identifier}`;
  rateLimitStore.delete(key);
  logger.info('Identifier unblocked', { identifier });
}

/**
 * Get rate limit stats for monitoring
 */
export function getRateLimitStats(): {
  totalEntries: number;
  blockedIdentifiers: number;
} {
  let blockedCount = 0;
  
  for (const entry of rateLimitStore.values()) {
    if (entry.blocked) {
      blockedCount++;
    }
  }

  return {
    totalEntries: rateLimitStore.size,
    blockedIdentifiers: blockedCount,
  };
}
