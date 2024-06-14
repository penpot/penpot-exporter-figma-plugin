import { Command } from 'svg-path-parser';

import { applyInverseRotation, applyRotation, hasRotation } from '@plugin/utils';

import { Segment } from '@ui/lib/types/shapes/pathShape';

import { translateCommandsToSegments } from '.';

export const translateLineNode = (node: LineNode, baseX: number, baseY: number): Segment[] => {
  if (!hasRotation(node.rotation) || !node.absoluteBoundingBox) {
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

  const startPoint = applyRotation(
    { x: 0, y: 0 },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  const endPoint = applyRotation(
    { x: node.width, y: 0 },
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

  const referencePoint = applyInverseRotation(
    { x: node.x, y: node.y },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  return translateCommandsToSegments(commands, baseX + referencePoint.x, baseY + referencePoint.y);
};
