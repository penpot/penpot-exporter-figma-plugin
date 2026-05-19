import type { Command } from 'svg-path-parser';

import { translateCommandToPathString } from '@plugin/translators/vectors/translateNonRotatedCommands';
import { applyMatrixToCommand } from '@plugin/utils';

export const serializeCommands = (commands: Command[], matrix: Transform): string =>
  commands
    .map(c => translateCommandToPathString(applyMatrixToCommand(c, matrix)))
    .filter(s => s.length > 0)
    .join(' ');
