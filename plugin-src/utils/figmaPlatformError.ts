// Known error signatures of an internal Figma platform failure that corrupts
// property reads on (mostly virtual) nodes after enough export work in one run.
// Observed with Grid auto-layout files; see PR #408. Anything else must propagate.
const FIGMA_PLATFORM_ERROR_SIGNATURES = [
  'Attempted to invoke callback with invalid id',
  'Expected node id to be a string, got undefined',
  'Property "gridItemsPositioning" failed validation'
] as const;

export const isFigmaPlatformError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);

  return FIGMA_PLATFORM_ERROR_SIGNATURES.some(signature => message.includes(signature));
};
