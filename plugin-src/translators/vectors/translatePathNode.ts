import { parseSVG } from 'svg-path-parser';

import { applyInverseRotation, hasRotation } from '@plugin/utils';

import { Segment } from '@ui/lib/types/shapes/pathShape';
import { Point } from '@ui/lib/types/utils/point';

import { translateCommandsToSegments } from '.';

export const translatePathNode = (
  node: StarNode | PolygonNode,
  baseRotation: number
): Segment[] => {
  let referencePoint: Point = {
    x: node.absoluteTransform[0][2],
    y: node.absoluteTransform[1][2]
  };

  if (hasRotation(node.rotation + baseRotation) && node.absoluteBoundingBox) {
    referencePoint = applyInverseRotation(
      { x: referencePoint.x, y: referencePoint.y },
      node.absoluteTransform,
      node.absoluteBoundingBox
    );
  }

  const segments: Segment[] = [];

  for (const path of node.fillGeometry) {
    segments.push(...translateVectorPath(path, referencePoint.x, referencePoint.y));
  }

  return segments;
};

const translateVectorPath = (path: VectorPath, baseX: number, baseY: number): Segment[] =>
  translateCommandsToSegments(parseSVG(path.data), baseX, baseY);
