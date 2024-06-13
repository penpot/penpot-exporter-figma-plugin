import { Point } from '@ui/lib/types/utils/point';

export const applyRotationToPoint = (
  point: Point,
  transform: Transform,
  boundingBox: Rect
): Point => {
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
