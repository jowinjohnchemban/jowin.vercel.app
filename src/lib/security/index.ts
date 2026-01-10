/**
 * Security Module
 * 
 * Comprehensive security module for runtime threat detection and monitoring.
 * Designed to be a standalone, reusable security package.
 * 
 * @module lib/security
 * 
 * Features:
 * - Input validation and sanitization
 * - Secret leak detection
 * - XSS, SQL injection, and other attack pattern detection
 * - Rate limiting and brute force protection
 * - Authentication monitoring
 * - Security event logging
 * - Email alerts for security incidents
 * 
 * @example
 * ```typescript
 * import { isInputSafe, detectAllThreats } from '@/lib/security';
 * 
 * const { safe, threats } = isInputSafe(userInput);
 * if (!safe) {
 *   // Handle security threat
 * }
 * ```
 */

export * from './sanitizer';
export * from './secrets';
export * from './alerts';
export * from './detector';
export * from './limiter';
export * from './auth';
export * from './events';
export * from './init';

// Export specific items from schemas to avoid naming conflicts
export { 
  validateInput, 
  validateRateLimitConfig, 
  validateAuthEvent,
  rateLimitConfigSchema,
  securityApiParamsSchema,
  inputValidationSchema,
  authEventSchema,
  severitySchema
} from './schemas';
export type { RateLimitConfig, SecurityApiParams, AuthEvent, Severity } from './schemas';
