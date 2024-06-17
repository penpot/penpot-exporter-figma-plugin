import { Command, CurveToCommand, LineToCommand, MoveToCommand } from 'svg-path-parser';

import { Segment } from '@ui/lib/types/shapes/pathShape';

export const translateNonRotatedCommands = (
  commands: Command[],
  baseX: number = 0,
  baseY: number = 0
): Segment[] => {
  return commands.map(command => translateNonRotatedCommand(command, baseX, baseY));
};

export const translateNonRotatedCommand = (
  command: Command,
  baseX: number,
  baseY: number
): Segment => {
  switch (command.command) {
    case 'moveto':
      return translateMoveTo(command, baseX, baseY);
    case 'lineto':
      return translateLineTo(command, baseX, baseY);
    case 'curveto':
      return translateCurveTo(command, baseX, baseY);
    case 'closepath':
    default:
      return {
        command: 'close-path'
      };
  }
};

const translateMoveTo = (command: MoveToCommand, baseX: number, baseY: number): Segment => {
  return {
    command: 'move-to',
    params: { x: command.x + baseX, y: command.y + baseY }
  };
};

const translateLineTo = (command: LineToCommand, baseX: number, baseY: number): Segment => {
  return {
    command: 'line-to',
    params: { x: command.x + baseX, y: command.y + baseY }
  };
};

const translateCurveTo = (command: CurveToCommand, baseX: number, baseY: number): Segment => {
  return {
    command: 'curve-to',
    params: {
      c1x: command.x1 + baseX,
      c1y: command.y1 + baseY,
      c2x: command.x2 + baseX,
      c2y: command.y2 + baseY,
      x: command.x + baseX,
      y: command.y + baseY
    }
  };
};
