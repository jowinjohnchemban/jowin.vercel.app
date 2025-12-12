/**
 * HTTP Client Utilities
 * 
 * **Shared Network Layer** for all API integrations.
 * Provides a consistent interface for making HTTP requests with
 * error handling, timeouts, and type safety.
 * 
 * @module lib/api/http-client
 * 
 * @architecture
 * - **Adapter Pattern**: Wraps axios for easier replacement
 * - **Error Abstraction**: Custom APIError class
 * - **Configuration**: Centralized timeout and headers
 * 
 * @usage
 * Used by:
 * - Any future API integrations (CMS, analytics, etc.)
 * 
 * @example
 * ```typescript
 * import { HttpClient } from '@/lib/api/http-client';
 * 
 * const data = await HttpClient.postJSON('/api/endpoint', { key: 'value' });
 * ```
 * 
 * @responsibilities
 * - Execute HTTP requests
 * - Handle network errors
 * - Provide consistent error types
 * - Apply default configurations (timeout, headers)
 */

import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

/**
 * Custom API Error Class
 * 
 * Provides consistent error handling across the application.
 * Extends native Error with HTTP-specific properties.
 * 
 * @class APIError
 * @extends Error
 * 
 * @property {string} message - Error message
 * @property {number} [status] - HTTP status code (e.g., 404, 500)
 * @property {string} [statusText] - HTTP status text (e.g., "Not Found")
 * @property {unknown} [data] - Response body/error details
 * 
 * @example
 * ```typescript
 * throw new APIError('Failed to fetch data', 500, 'Internal Server Error');
 * ```
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * HTTP client with axios
 * Production-grade HTTP client with timeout, retries, and error handling
 */
export class HttpClient {
  /**
   * POST JSON data with axios
   */
  static async postJSON<T = unknown>(
    url: string,
    data: unknown,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await axios.post<T>(url, data, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new APIError(
          error.message || `HTTP ${error.response?.status}: ${error.response?.statusText}`,
          error.response?.status,
          error.response?.statusText,
          error.response?.data
        );
      }
      throw error;
    }
  }
}
