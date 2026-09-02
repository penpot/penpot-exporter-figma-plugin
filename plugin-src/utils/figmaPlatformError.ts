// Known error signatures of an internal Figma platform failure that corrupts
// property reads on (mostly virtual) nodes after enough export work in one run.
// Observed with Grid auto-layout files; validation failures match generically. See PR #408. Anything else must propagate.
const FIGMA_PLATFORM_ERROR_SIGNATURES = [
  'Attempted to invoke callback with invalid id',
  'Expected node id to be a string, got undefined',
  'failed validation'
] as const;

// Marks data reads that returned impossible values per Plugin API typings; same grid-corruption family. See PR #408.
export class FigmaPlatformDataError extends Error {}

export const isFigmaPlatformError = (error: unknown): boolean => {
  if (error instanceof FigmaPlatformDataError) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);

  return FIGMA_PLATFORM_ERROR_SIGNATURES.some(signature => message.includes(signature));
};
