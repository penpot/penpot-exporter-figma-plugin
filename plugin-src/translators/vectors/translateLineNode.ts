import { Command } from 'svg-path-parser';

import { applyInverseRotation, applyRotation, hasRotation } from '@plugin/utils';

import { Segment } from '@ui/lib/types/shapes/pathShape';

import { translateCommandsToSegments } from '.';

export const translateLineNode = (node: LineNode, baseRotation: number): Segment[] => {
  const rotation = node.rotation + baseRotation;
  const x = node.absoluteTransform[0][2];
  const y = node.absoluteTransform[1][2];

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
      x,
      y
    );
  }

  const referencePoint = applyInverseRotation(
    { x, y },
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
      x,
      y,
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

  return translateCommandsToSegments(commands);
};
