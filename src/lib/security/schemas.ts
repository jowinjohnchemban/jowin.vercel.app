/**
 * Security Validation Schemas
 * 
 * Zod schemas for validating security-related data
 * 
 * @module lib/security/schemas
 */

import { z } from 'zod';

/**
 * Rate limit configuration schema
 */
export const rateLimitConfigSchema = z.object({
  maxRequests: z.number().int().positive().min(1).max(10000),
  windowMs: z.number().int().positive().min(1000).max(3600000), // 1s to 1h
  identifier: z.string().optional(),
});

export type RateLimitConfig = z.infer<typeof rateLimitConfigSchema>;

/**
 * Security API query params schema
 */
export const securityApiParamsSchema = z.object({
  secret: z.string().optional(),
  alert: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
});

export type SecurityApiParams = z.infer<typeof securityApiParamsSchema>;

/**
 * Auth event schema
 */
export const authEventSchema = z.object({
  identifier: z.string().min(1).max(255),
  eventType: z.enum(['login-success', 'login-failure', 'password-reset', 'account-locked']),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional(),
});

export type AuthEvent = z.infer<typeof authEventSchema>;

/**
 * Security event severity schema
 */
export const severitySchema = z.enum(['low', 'medium', 'high', 'critical']);

export type Severity = z.infer<typeof severitySchema>;

/**
 * Input validation schema for threat detection
 */
export const inputValidationSchema = z.string().min(1).max(10000);

/**
 * Validate and sanitize input for threat detection
 */
export function validateInput(input: unknown): { valid: boolean; data?: string; error?: string } {
  const result = inputValidationSchema.safeParse(input);
  
  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message || 'Invalid input',
    };
  }

  return {
    valid: true,
    data: result.data,
  };
}

/**
 * Validate rate limit config
 */
export function validateRateLimitConfig(
  config: unknown
): { valid: boolean; data?: RateLimitConfig; error?: string } {
  const result = rateLimitConfigSchema.safeParse(config);
  
  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message || 'Invalid rate limit configuration',
    };
  }

  return {
    valid: true,
    data: result.data,
  };
}

/**
 * Validate auth event
 */
export function validateAuthEvent(
  event: unknown
): { valid: boolean; data?: AuthEvent; error?: string } {
  const result = authEventSchema.safeParse(event);
  
  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message || 'Invalid auth event',
    };
  }

  return {
    valid: true,
    data: result.data,
  };
}
