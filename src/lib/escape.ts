/**
 * Encodes a string to base64 (browser safe)
 */
export function encodeBase64(input: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(input);
  } else {
    return Buffer.from(input, 'utf-8').toString('base64');
  }
}

/**
 * Decodes a base64 string (browser/node safe)
 */
export function decodeBase64(input: string): string {
  if (typeof window !== 'undefined' && window.atob) {
    return window.atob(input);
  } else {
    return Buffer.from(input, 'base64').toString('utf-8');
  }
}

import he from "he";

/**
 * Decodes HTML entities in a string using the 'he' library. Use for any context (HTML, email, etc).
 */
export function unescape(input: string): string {
  return he.decode(input);
}

/**
 * Escapes HTML special characters in a string using the 'he' library (standard way).
 */
export function escapeHtml(input: string): string {
  return he.escape(input);
}

/**
 * Escapes HTML special characters in an email string using the 'he' library (standard way).
 * Use unescape to decode when rendering or processing.
 */
export function escapeEmail(input: string): string {
  return he.escape(input);
}
