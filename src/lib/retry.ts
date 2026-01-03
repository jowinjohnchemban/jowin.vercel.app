/**
 * Retry Utility Module
 * 
 * Implements exponential backoff retry logic for resilient API calls.
 * Automatically retries failed requests with increasing delays.
 * 
 * @module lib/retry
 * 
 * @usage
 * ```typescript
 * import { retry } from '@/lib/retry';
 * 
 * const data = await retry(
 *   () => fetch('/api/data'),
 *   { maxAttempts: 3, initialDelay: 1000 }
 * );
 * ```
 */

import { logger } from '@/lib/logger';

/**
 * Retry options for controlling retry behavior
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 10000) */
  maxDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
  /** Additional context for logging */
  context?: Record<string, unknown>;
}

/**
 * Determines if an error is retryable
 * 
 * Retryable errors:
 * - Network errors (timeout, connection refused)
 * - 5xx server errors (500, 502, 503, 504)
 * - 408 Request Timeout
 * - 429 Too Many Requests
 * 
 * Non-retryable errors:
 * - 4xx client errors (except 408, 429)
 * - Authentication errors
 * - Validation errors
 */
function isRetryableError(error: unknown): boolean {
  // Network errors are retryable
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('network')
    ) {
      return true;
    }
  }

  // Check for HTTP status codes (if available)
  if (typeof error === 'object' && error !== null) {
    const httpError = error as Record<string, unknown>;
    const status =
      (httpError.status as number | undefined) ||
      (httpError.statusCode as number | undefined) ||
      ((httpError.response as Record<string, unknown>)?.status as number | undefined);

    if (typeof status === 'number') {
      // Retry on server errors and specific client errors
      return (
        (status >= 500 && status < 600) || // 5xx errors
        status === 408 || // Request Timeout
        status === 429 // Too Many Requests
      );
    }
  }

  return false;
}

/**
 * Calculate delay for exponential backoff with jitter
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number {
  // Exponential backoff: initialDelay * (multiplier ^ attempt)
  const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);

  // Cap at maxDelay
  const cappedDelay = Math.min(exponentialDelay, maxDelay);

  // Add random jitter (±20%) to prevent thundering herd
  const jitter = cappedDelay * (0.8 + Math.random() * 0.4);

  return Math.round(jitter);
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Result of the function
 * @throws Original error if all retries exhausted
 * 
 * @example
 * ```typescript
 * const data = await retry(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     if (!response.ok) throw new Error('Failed');
 *     return response.json();
 *   },
 *   { maxAttempts: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    context = {},
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Attempt the operation
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (!isRetryableError(error) || attempt === maxAttempts) {
        // Non-retryable error or last attempt - throw immediately
        logger.error('Operation failed (not retryable)', error, {
          ...context,
          attempt,
          maxAttempts,
        });
        throw error;
      }

      // Calculate delay and log retry attempt
      const delay = calculateDelay(
        attempt,
        initialDelay,
        maxDelay,
        backoffMultiplier
      );

      logger.warn('Retrying operation', {
        ...context,
        attempt,
        maxAttempts,
        nextRetryIn: `${delay}ms`,
        error: error instanceof Error ? error.message : String(error),
      });

      // Wait before retrying
      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Retry exhausted');
}

/**
 * Retry configuration presets for different scenarios
 */
export const retryPresets = {
  /** Aggressive retries for critical operations */
  critical: {
    maxAttempts: 5,
    initialDelay: 500,
    maxDelay: 15000,
    backoffMultiplier: 2,
  },

  /** Standard retries for normal operations */
  standard: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },

  /** Light retries for quick operations */
  light: {
    maxAttempts: 2,
    initialDelay: 500,
    maxDelay: 5000,
    backoffMultiplier: 2,
  },

  /** No retries - fail fast */
  none: {
    maxAttempts: 1,
  },
} as const;

/**
 * Wrap a function to automatically retry on failure
 * 
 * @param fn - Function to wrap
 * @param options - Retry options
 * @returns Wrapped function that retries on failure
 * 
 * @example
 * ```typescript
 * const fetchWithRetry = withRetry(
 *   async (url) => fetch(url),
 *   retryPresets.standard
 * );
 * 
 * const data = await fetchWithRetry('/api/data');
 * ```
 */
export function withRetry<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {}
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    return retry(() => fn(...args), options);
  };
}
