// Known error signatures of an internal Figma platform failure that corrupts
// property reads on (mostly virtual) nodes after enough export work in one run.
// Observed with Grid auto-layout files; see PR #408. Anything else must propagate.
const FIGMA_PLATFORM_ERROR_SIGNATURES = [
  'Attempted to invoke callback with invalid id',
  'Expected node id to be a string, got undefined',
  'Property "gridItemsPositioning" failed validation'
] as const;

let corruptionDetected = false;

export const isFigmaPlatformError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    FIGMA_PLATFORM_ERROR_SIGNATURES.some(signature => error.message.includes(signature))
  );
};

export const markFigmaPlatformCorruption = (): void => {
  corruptionDetected = true;
};

export const hasFigmaPlatformCorruption = (): boolean => corruptionDetected;

export const resetFigmaPlatformCorruption = (): void => {
  corruptionDetected = false;
};

/**
 * In a healthy export, only known signatures indicate a Figma platform failure.
 * Once detected, subsequent per-layer errors are contained because corruption messages are unreliable.
 */
export const isFigmaPlatformFailure = (error: unknown): boolean => {
  if (isFigmaPlatformError(error)) {
    markFigmaPlatformCorruption();
    return true;
  }

  return hasFigmaPlatformCorruption();
};
