import type { Command } from 'svg-path-parser';

import { normalizeCommands } from '@plugin/translators/vectors/normalizeCommands';
import { serializeCommands } from '@plugin/translators/vectors/serializeCommands';

export const translateCommands = (node: LayoutMixin, commands: Command[]): string =>
  serializeCommands(normalizeCommands(commands), node.absoluteTransform);
