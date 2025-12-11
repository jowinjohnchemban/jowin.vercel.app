/**
 * Security Utilities
 * @module lib/security/sanitizer
 */

import DOMPurify from "dompurify";

/**
 * HTML Sanitizer class for cleaning user input
 */
export class Sanitizer {
  /**
   * Sanitize HTML input by removing all tags and dangerous characters
   * @param input - The string to sanitize
   * @returns Sanitized string
   */
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }).trim();
  }

  /**
   * Sanitize plain text (server-side fallback)
   * @param input - The string to sanitize
   * @returns Sanitized string
   */
  static sanitizePlainText(input: string): string {
    // Remove HTML tags and trim
    return input.replace(/<[^>]*>/g, "").trim();
  }

  /**
   * Sanitize multiple fields at once
   * @param data - Object with fields to sanitize
   * @returns Sanitized object
   */
  static sanitizeObject<T extends Record<string, string>>(data: T): T {
    const sanitized = {} as T;
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        sanitized[key as keyof T] = this.sanitizeHTML(value) as T[keyof T];
      } else {
        sanitized[key as keyof T] = value;
      }
    }
    return sanitized;
  }
}
