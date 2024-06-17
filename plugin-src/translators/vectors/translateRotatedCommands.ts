import { Command } from 'svg-path-parser';

import { applyInverseRotation, applyRotationToSegment } from '@plugin/utils';

import { ClosePath, Segment } from '@ui/lib/types/shapes/pathShape';

import { translateNonRotatedCommand } from '.';

const isClosePath = (segment: Segment): segment is ClosePath => segment.command === 'close-path';

export const translateRotatedCommands = (
  commands: Command[],
  transform: Transform,
  boundingBox: Rect
): Segment[] => {
  const referencePoint = applyInverseRotation(
    { x: transform[0][2], y: transform[1][2] },
    transform,
    boundingBox
  );

  return commands.map(command => {
    const segment = translateNonRotatedCommand(command, referencePoint.x, referencePoint.y);

    if (isClosePath(segment)) {
      return segment;
    }

    return applyRotationToSegment(segment, transform, boundingBox);
  });
};
