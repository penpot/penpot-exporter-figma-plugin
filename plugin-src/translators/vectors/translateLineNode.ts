import { Command } from 'svg-path-parser';

import { applyInverseRotation, applyRotation, hasRotation } from '@plugin/utils';

import { Segment } from '@ui/lib/types/shapes/pathShape';

import { translateCommandsToSegments } from '.';

export const translateLineNode = (
  node: LineNode,
  baseX: number,
  baseY: number,
  baseRotation: number
): Segment[] => {
  const rotation = node.rotation + baseRotation;

  if (!hasRotation(rotation) || !node.absoluteBoundingBox) {
    return translateCommandsToSegments(
      [
        {
          x: 0,
          y: 0,
          command: 'moveto',
          code: 'M'
        },
        {
          x: node.width,
          y: 0,
          command: 'lineto',
          code: 'L'
        }
      ],
      baseX + node.x,
      baseY + node.y
    );
  }

  const referencePoint = applyInverseRotation(
    { x: node.x, y: node.y },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  const startPoint = applyRotation(
    { x: referencePoint.x, y: referencePoint.y },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  const endPoint = applyRotation(
    { x: referencePoint.x + node.width, y: referencePoint.y },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  const commands: Command[] = [
    {
      x: startPoint.x,
      y: startPoint.y,
      command: 'moveto',
      code: 'M'
    },
    {
      x: endPoint.x,
      y: endPoint.y,
      command: 'lineto',
      code: 'L'
    }
  ];

  return translateCommandsToSegments(commands, baseX, baseY);
};
