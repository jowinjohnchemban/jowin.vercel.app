// src/lib/imageQuality.ts
/**
 * Returns an optimal image quality factor based on network and device conditions.
 * Used for Next.js Image components to balance performance and clarity.
 */
export function getImageQuality(): number {
  if (typeof window === "undefined") return 95; // SSR default
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection || {};
  if (conn.saveData) return 30;
  if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") return 30;
  if (conn.effectiveType === "3g") return 50;
  if (window.devicePixelRatio > 1.5) return 80;
  return 75;
}
