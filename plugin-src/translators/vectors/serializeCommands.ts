import type { Command } from 'svg-path-parser';

import { applyMatrixToCommand } from '@plugin/utils';

const serializeCommand = (command: Command): string => {
  switch (command.command) {
    case 'moveto':
      return `M ${command.x} ${command.y}`;
    case 'lineto':
      return `L ${command.x} ${command.y}`;
    case 'curveto':
      return `C ${command.x1} ${command.y1}, ${command.x2} ${command.y2}, ${command.x} ${command.y}`;
    case 'closepath':
      return 'Z';
    default:
      return '';
  }
};

export const serializeCommands = (commands: Command[], matrix: Transform): string =>
  commands
    .map(c => serializeCommand(applyMatrixToCommand(c, matrix)))
    .filter(s => s.length > 0)
    .join(' ');
