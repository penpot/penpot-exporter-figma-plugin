import { getBoundingBox } from '@plugin/utils';

import { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';
import { Point } from '@ui/lib/types/utils/point';

export const transformDimensionAndPosition = (
  node: LayoutMixin,
  baseX: number,
  baseY: number
): ShapeGeomAttributes => {
  let point = {
    x: node.x + baseX,
    y: node.y + baseY
  };

  if (node.rotation !== 0) {
    const rotatedPoint = getRotatedPoint({ x: node.x + baseX, y: node.y + baseY }, node);
    if (rotatedPoint) {
      point = rotatedPoint;
    }
  }
  return {
    ...point,
    width: node.width,
    height: node.height
  };
};

export const transformDimensionAndPositionFromVectorPath = (
  vectorPath: VectorPath,
  baseX: number,
  baseY: number
): ShapeGeomAttributes => {
  const boundingBox = getBoundingBox(vectorPath);

  return {
    x: boundingBox.x1 + baseX,
    y: boundingBox.y1 + baseY,
    width: boundingBox.x2 - boundingBox.x1,
    height: boundingBox.y2 - boundingBox.y1
  };
};
const getRotatedPoint = (point: Point, node: DimensionAndPositionMixin): Point | undefined => {
  if (!node.absoluteBoundingBox) {
    return;
  }

  const centerPoint = {
    x: node.absoluteBoundingBox.x + node.absoluteBoundingBox.width / 2,
    y: node.absoluteBoundingBox.y + node.absoluteBoundingBox.height / 2
  };

  const relativePoint = {
    x: point.x - centerPoint.x,
    y: point.y - centerPoint.y
  };

  const rotatedPoint = {
    x:
      relativePoint.x * node.absoluteTransform[0][0] +
      relativePoint.y * node.absoluteTransform[1][0],
    y:
      relativePoint.x * node.absoluteTransform[0][1] +
      relativePoint.y * node.absoluteTransform[1][1]
  };

  return {
    x: centerPoint.x + rotatedPoint.x,
    y: centerPoint.y + rotatedPoint.y
  };
};
