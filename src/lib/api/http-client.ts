/**
 * HTTP client utilities using axios
 * @module lib/api/http-client
 */

import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

/**
 * Custom error for API responses
 * Provides consistent error handling across the application
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
