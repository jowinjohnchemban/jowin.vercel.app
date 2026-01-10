import he from "he";

/**
 * Escapes all HTML entities in a string using the 'he' library.
 */
export function escapeHtml(input: string): string {
  return he.encode(input, { useNamedReferences: true });
}

/**
 * Escapes only <, >, &, ", ' in an email string, but not @ or .
 */
export function escapeEmail(input: string): string {
  // Temporarily replace @ and . to prevent encoding
  return he.encode(input.replace(/[@.]/g, c => `__SAFE__${c.charCodeAt(0)}__`), { useNamedReferences: true })
    .replace(/__SAFE__(\d+)__/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}
