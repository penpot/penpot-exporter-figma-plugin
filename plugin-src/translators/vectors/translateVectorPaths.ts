import { Command, CurveToCommand, LineToCommand, MoveToCommand, parseSVG } from 'svg-path-parser';

import { Segment } from '@ui/lib/types/shapes/pathShape';

export const translateVectorPaths = (
  paths: VectorPaths,
  baseX: number,
  baseY: number
): Segment[] => {
  let segments: Segment[] = [];

  for (const path of paths) {
    const normalizedPaths = parseSVG(path.data);

    segments = [...segments, ...translateCommandsToSegments(normalizedPaths, baseX, baseY)];
  }

  return segments;
};

export const translateCommandsToSegments = (
  commands: Command[],
  baseX: number,
  baseY: number
): Segment[] => {
  return commands.map(command => {
    switch (command.command) {
      case 'moveto':
        return translateMoveToCommand(command, baseX, baseY);
      case 'lineto':
        return translateLineToCommand(command, baseX, baseY);
      case 'curveto':
        return translateCurveToCommand(command, baseX, baseY);
      case 'closepath':
      default:
        return {
          command: 'close-path'
        };
    }
  });
};

const translateMoveToCommand = (command: MoveToCommand, baseX: number, baseY: number): Segment => {
  return {
    command: 'move-to',
    params: { x: command.x + baseX, y: command.y + baseY }
  };
};

const translateLineToCommand = (command: LineToCommand, baseX: number, baseY: number): Segment => {
  return {
    command: 'line-to',
    params: { x: command.x + baseX, y: command.y + baseY }
  };
};

const translateCurveToCommand = (
  command: CurveToCommand,
  baseX: number,
  baseY: number
): Segment => {
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
