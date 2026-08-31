export const PENPOT_SAFE_NUMBER_MIN = -2147483648;
export const PENPOT_SAFE_NUMBER_MAX = 2147483647;

/**
 * Clamps a value to Penpot's "safe number" schema (int32 range), mapping `NaN`
 * to `0`. A nearly-singular gradient transform inverts to coordinates far
 * outside that range, which Penpot rejects ("expected valid color/shape").
 */
export const clampToSafeNumber = (value: number): number => {
  if (Number.isNaN(value)) return 0;
  return Math.min(PENPOT_SAFE_NUMBER_MAX, Math.max(PENPOT_SAFE_NUMBER_MIN, value));
};
