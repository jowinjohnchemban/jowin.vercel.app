/**
 * Logger Utility Module
 * 
 * Provides consistent logging across the application with:
 * - Development vs production log levels
 * - Structured logging format
 * - Error tracking with context
 * 
 * @module lib/logger
 * 
 * @usage
 * ```typescript
 * import { logger } from '@/lib/logger';
 * 
 * logger.info('User logged in', { userId: 123 });
 * logger.error('Failed to fetch data', error);
 * logger.warn('Slow API response', { duration: 5000 });
 * ```
 */

type LogContext = Record<string, unknown>;

const isDevelopment = process.env.NODE_ENV === 'development';
const prefix = '[JOWIN]';

/**
 * Format log message with timestamp
 * @param level - Log level (DEBUG, INFO, WARN, ERROR)
 * @param message - Main message
 * @param context - Optional context object
 * @returns Formatted log string
 */
function formatLog(level: string, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  let output = `${prefix} [${timestamp}] [${level}] ${message}`;
  
  if (context && Object.keys(context).length > 0) {
    output += ` ${JSON.stringify(context)}`;
  }
  
  return output;
}

/**
 * Logger with development and production modes
 * 
 * In production:
 * - Only errors are logged
 * - Info level includes important events
 * - Debug logs are suppressed
 * 
 * In development:
 * - All levels are logged
 * - More verbose output for debugging
 */
export const logger = {
  /**
   * Debug level - Development only
   * Use for detailed debugging information
   */
  debug: (message: string, context?: LogContext): void => {
    if (isDevelopment) {
      console.debug(formatLog('DEBUG', message, context));
    }
  },

  /**
   * Info level - All environments
   * Use for important application events
   */
  info: (message: string, context?: LogContext): void => {
    console.info(formatLog('INFO', message, context));
  },

  /**
   * Warn level - All environments
   * Use for potentially problematic situations
   */
  warn: (message: string, context?: LogContext): void => {
    console.warn(formatLog('WARN', message, context));
  },

  /**
   * Error level - All environments
   * Use for error events and exceptions
   */
  error: (message: string, error?: unknown, context?: LogContext): void => {
    const errorContext: LogContext = { ...context };
    
    if (error instanceof Error) {
      errorContext.errorMessage = error.message;
      errorContext.errorStack = isDevelopment ? error.stack : undefined;
    } else if (error) {
      errorContext.error = String(error);
    }
    
    console.error(formatLog('ERROR', message, errorContext));
  },

  /**
   * Log API call details
   * Useful for monitoring API performance
   */
  api: (method: string, url: string, status?: number, duration?: number): void => {
    const context: LogContext = { method, url };
    if (status) context.status = status;
    if (duration) context.duration = `${duration}ms`;
    
    const level = status && status >= 400 ? 'WARN' : 'INFO';
    console.log(formatLog(level, 'API Request', context));
  },
};

/**
 * Performance monitor for tracking execution time
 * 
 * @example
 * ```typescript
 * const timer = logger.timer('Fetch blog posts');
 * // ... do async work
 * timer.end(); // Logs: "[JOWIN] Fetch blog posts completed in 234ms"
 * ```
 */
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
    if (isDevelopment) {
      logger.debug(`Starting: ${label}`);
    }
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    const message = `${this.label} completed in ${Math.round(duration)}ms`;
    
    if (duration > 5000) {
      logger.warn(message);
    } else if (isDevelopment) {
      logger.debug(message);
    }
    
    return duration;
  }
}

export function createTimer(label: string): PerformanceTimer {
  return new PerformanceTimer(label);
}
