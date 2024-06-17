import { ClosePath, CurveTo, Segment } from '@ui/lib/types/shapes/pathShape';
import { Point } from '@ui/lib/types/utils/point';

const ROTATION_TOLERANCE = 0.000001;

export const applyRotation = (point: Point, transform: Transform, boundingBox: Rect): Point => {
  const centerPoint = calculateCenter(boundingBox);

  const rotatedPoint = applyMatrix(transform, {
    x: point.x - centerPoint.x,
    y: point.y - centerPoint.y
  });

  return {
    x: centerPoint.x + rotatedPoint.x,
    y: centerPoint.y + rotatedPoint.y
  };
};

export const applyRotationToSegment = (
  segment: Exclude<Segment, ClosePath>,
  transform: Transform,
  boundingBox: Rect
): Segment => {
  const rotated = applyRotation(
    { x: segment.params.x, y: segment.params.y },
    transform,
    boundingBox
  );

  if (isCurveTo(segment)) {
    const curve1 = applyRotation(
      { x: segment.params.c1x, y: segment.params.c1y },
      transform,
      boundingBox
    );
    const curve2 = applyRotation(
      { x: segment.params.c2x, y: segment.params.c2y },
      transform,
      boundingBox
    );

    segment.params.c1x = curve1.x;
    segment.params.c1y = curve1.y;
    segment.params.c2x = curve2.x;
    segment.params.c2y = curve2.y;
  }

  segment.params.x = rotated.x;
  segment.params.y = rotated.y;

  return segment;
};

export const applyInverseRotation = (
  point: Point,
  transform: Transform,
  boundingBox: Rect
): Point => applyRotation(point, inverseMatrix(transform), boundingBox);

export const hasRotation = (rotation: number): boolean => Math.abs(rotation) > ROTATION_TOLERANCE;

const inverseMatrix = (matrix: Transform): Transform => [
  [matrix[0][0], matrix[1][0], matrix[0][2]],
  [matrix[0][1], matrix[1][1], matrix[1][2]]
];

const applyMatrix = (matrix: Transform, point: Point): Point => ({
  x: point.x * matrix[0][0] + point.y * matrix[0][1],
  y: point.x * matrix[1][0] + point.y * matrix[1][1]
});

const calculateCenter = (boundingBox: Rect): Point => ({
  x: boundingBox.x + boundingBox.width / 2,
  y: boundingBox.y + boundingBox.height / 2
});

const isCurveTo = (segment: Segment): segment is CurveTo => segment.command === 'curve-to';
