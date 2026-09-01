/**
 * Clamps a value to the [min, max] range. Figma can expose out-of-range
 * values (e.g. gradient stop positions > 1 pasted via Figma Code),
 * which Penpot rejects, so sanitize before passing values on.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
