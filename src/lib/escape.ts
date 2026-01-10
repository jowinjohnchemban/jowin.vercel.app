
import he from 'he';

/**
 * Decodes HTML entities in a string using the 'he' library. Use for any context (HTML, email, etc).
 */
export function unescape(input: string): string {
  return he.unescape(input);
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
