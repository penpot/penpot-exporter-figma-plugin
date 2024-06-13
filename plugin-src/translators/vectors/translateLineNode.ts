import { Command } from 'svg-path-parser';

import { applyRotationToPoint } from '@plugin/utils';

import { Segment } from '@ui/lib/types/shapes/pathShape';

import { translateCommandsToSegments } from '.';

export const translateLineNode = (node: LineNode, baseX: number, baseY: number): Segment[] => {
  if (!node.absoluteBoundingBox) return [];

  const inverseMatrix: Transform = [
    [node.absoluteTransform[0][0], node.absoluteTransform[1][0], 0],
    [node.absoluteTransform[0][1], node.absoluteTransform[1][1], 0]
  ];

  const startPoint = applyRotationToPoint({ x: 0, y: 0 }, inverseMatrix, node.absoluteBoundingBox);
  const endPoint = applyRotationToPoint(
    { x: node.width, y: 0 },
    inverseMatrix,
    node.absoluteBoundingBox
  );
  const referencePoint = applyRotationToPoint(
    { x: node.x, y: node.y },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  const commands: Command[] = [
    {
      x: startPoint.x + referencePoint.x,
      y: startPoint.y + referencePoint.y,
      command: 'moveto',
      code: 'M'
    },
    {
      x: endPoint.x + referencePoint.x,
      y: endPoint.y + referencePoint.y,
      command: 'lineto',
      code: 'L'
    }
  ];

  return translateCommandsToSegments(commands, baseX, baseY);
};
