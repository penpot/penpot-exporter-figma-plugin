import type { Command } from 'svg-path-parser';

import { applyMatrixToPoint } from '@plugin/utils/applyMatrixToPoint';

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
