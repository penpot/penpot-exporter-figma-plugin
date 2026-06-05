/**
 * Returns the value only if it is a finite number, otherwise `undefined`.
 * Figma can expose `NaN`/`Infinity` (e.g. a numeric field bound to a deleted
 * variable), which Penpot rejects, so sanitize before passing values on.
 */
export const finiteOrUndefined = (value: number | undefined): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;
