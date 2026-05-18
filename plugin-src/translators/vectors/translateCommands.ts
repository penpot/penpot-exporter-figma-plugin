import type { Command } from 'svg-path-parser';

import { normalizeCommands } from '@plugin/translators/vectors/normalizeCommands';
import { serializeCommands } from '@plugin/translators/vectors/serializeCommands';

// Figma's `absoluteTransform` already encodes rotation + translation as a 2x3
// affine. Applying it directly to each command produces the same canvas-space
// coordinates as the previous rotated/non-rotated split, which is provably
// equivalent: rotating around the bbox centre with a reference-point offset
// reduces algebraically to `transform * point`.
export const translateCommands = (node: LayoutMixin, commands: Command[]): string =>
  serializeCommands(normalizeCommands(commands), node.absoluteTransform);
