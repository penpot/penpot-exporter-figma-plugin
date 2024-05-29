import { ShapeBaseAttributes, ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';
import { Point } from '@ui/lib/types/utils/point';

export const transformRotationAndPosition = (
  node: LayoutMixin,
  baseX: number,
  baseY: number
): Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> &
  Pick<ShapeGeomAttributes, 'x' | 'y'> => {
  const rotation = node.rotation;
  const x = node.x + baseX;
  const y = node.y + baseY;

  if (rotation === 0 || !node.absoluteBoundingBox) {
    return {
      x,
      y,
      rotation,
      transform: undefined,
      transformInverse: undefined
    };
  }

  const point = getRotatedPoint({ x, y }, node.absoluteTransform, node.absoluteBoundingBox);

  return {
    ...point,
    rotation: -rotation < 0 ? -rotation + 360 : -rotation,
    transform: {
      a: node.absoluteTransform[0][0],
      b: node.absoluteTransform[1][0],
      c: node.absoluteTransform[0][1],
      d: node.absoluteTransform[1][1],
      e: 0,
      f: 0
    },
    transformInverse: {
      a: node.absoluteTransform[0][0],
      b: node.absoluteTransform[0][1],
      c: node.absoluteTransform[1][0],
      d: node.absoluteTransform[1][1],
      e: 0,
      f: 0
    }
  };
};

const getRotatedPoint = (point: Point, transform: Transform, boundingBox: Rect): Point => {
  const centerPoint = {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2
  };

  const relativePoint = {
    x: point.x - centerPoint.x,
    y: point.y - centerPoint.y
  };

  const rotatedPoint = {
    x: relativePoint.x * transform[0][0] + relativePoint.y * transform[1][0],
    y: relativePoint.x * transform[0][1] + relativePoint.y * transform[1][1]
  };

  return {
    x: centerPoint.x + rotatedPoint.x,
    y: centerPoint.y + rotatedPoint.y
  };
};
