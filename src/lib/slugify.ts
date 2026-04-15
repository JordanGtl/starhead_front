/**
 * Converts a string to a URL-friendly slug.
 * Removes accents, special characters; lowercases; replaces spaces with hyphens.
 *
 * Examples:
 *   "Bouclier d'Impact S3 A"  → "bouclier-d-impact-s3-a"
 *   "Aegis Dynamics"          → "aegis-dynamics"
 *   "RSI Aurora MR"           → "rsi-aurora-mr"
 */
export function slugify(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .normalize('NFD')                  // decompose accented chars (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '')   // strip combining diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')     // remove everything except a-z, 0-9, spaces, hyphens
    .replace(/\s+/g, '-')             // spaces → hyphens
    .replace(/-+/g, '-')              // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');         // trim leading/trailing hyphens
}
