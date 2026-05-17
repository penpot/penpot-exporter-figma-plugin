import type { Command } from 'svg-path-parser';

import { applyMatrixToPoint } from '@plugin/utils';

export const translateNonRotatedCommands = (
  commands: Command[],
  baseX: number = 0,
  baseY: number = 0
): string => {
  return commands
    .reduce((svgPath, command) => {
      const pathString = translateCommandToPathString(applyBase(command, baseX, baseY));

      return svgPath + pathString + ' ';
    }, '')
    .trimEnd();
};

export const translateCommandToPathString = (command: Command): string => {
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

export const applyBase = (command: Command, baseX: number, baseY: number): Command => {
  switch (command.command) {
    case 'lineto':
    case 'moveto':
      return {
        ...command,
        x: command.x + baseX,
        y: command.y + baseY
      };
    case 'curveto':
      return {
        ...command,
        x1: command.x1 + baseX,
        y1: command.y1 + baseY,
        x2: command.x2 + baseX,
        y2: command.y2 + baseY,
        x: command.x + baseX,
        y: command.y + baseY
      };
    default:
      return command;
  }
};

export const applyMatrixToCommand = (command: Command, matrix: Transform): Command => {
  const project = (x: number, y: number): { x: number; y: number } => {
    const [px, py] = applyMatrixToPoint(matrix, [x, y]);
    return { x: px, y: py };
  };

  switch (command.command) {
    case 'lineto':
    case 'moveto':
      return { ...command, ...project(command.x, command.y) };
    case 'curveto': {
      const c1 = project(command.x1, command.y1);
      const c2 = project(command.x2, command.y2);
      const end = project(command.x, command.y);
      return { ...command, x1: c1.x, y1: c1.y, x2: c2.x, y2: c2.y, x: end.x, y: end.y };
    }
    default:
      return command;
  }
};
