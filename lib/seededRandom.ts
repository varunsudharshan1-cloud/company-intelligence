/**
 * Produces a deterministic 32-bit hash from a string. Used so that the same
 * domain always yields the same "random" looking numbers across renders.
 */
export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Returns a deterministic integer between min (inclusive) and max (inclusive)
 * derived from a seed string and an optional salt to vary multiple draws
 * from the same seed.
 */
export function seededInt(seed: string, min: number, max: number, salt = 0): number {
  const hash = hashString(`${seed}::${salt}`);
  const range = max - min + 1;
  return min + (hash % range);
}
