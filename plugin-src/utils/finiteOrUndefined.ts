/**
 * Returns the value only if it is a finite number, otherwise `undefined`.
 *
 * Figma can yield `NaN` (or `Infinity`) for numeric fields, most commonly when
 * a node references a numeric variable that has been deleted: Figma keeps
 * rendering it as `0`, but the API exposes the orphaned value as `NaN`. Penpot
 * rejects `NaN`/`Infinity` and refuses the whole shape, so sanitize numeric
 * values coming from the Figma API before passing them on.
 */
export const finiteOrUndefined = (value: number | undefined): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;
