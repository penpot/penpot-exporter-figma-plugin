import type { Point } from '@ui/lib/types/utils/point';

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

export const applyInverseRotation = (
  point: Point,
  transform: Transform,
  boundingBox: Rect
): Point => applyRotation(point, inverseMatrix(transform), boundingBox);

export const getRotation = (transform: Transform): number =>
  Math.acos(transform[0][0]) * (180 / Math.PI);

export const isTransformed = (transform: Transform): boolean => {
  return !isIdentityMatrix(transform);
};

const inverseMatrix = (matrix: Transform): Transform => [
  [matrix[0][0], matrix[1][0], matrix[0][2]],
  [matrix[0][1], matrix[1][1], matrix[1][2]]
];

const applyMatrix = (matrix: Transform, point: Point): Point => ({
  x: point.x * matrix[0][0] + point.y * matrix[0][1],
  y: point.x * matrix[1][0] + point.y * matrix[1][1]
});

const isIdentityMatrix = (matrix: Transform): boolean => {
  return (
    cleanNumber(matrix[0][0]) === 1 &&
    cleanNumber(matrix[0][1]) === 0 &&
    cleanNumber(matrix[1][0]) === 0 &&
    cleanNumber(matrix[1][1]) === 1
  );
};

const calculateCenter = (boundingBox: Rect): Point => ({
  x: boundingBox.x + boundingBox.width / 2,
  y: boundingBox.y + boundingBox.height / 2
});

const cleanNumber = (value: number, epsilon = 1e-6, decimals = 6): number => {
  return Math.abs(value) < epsilon ? 0 : +value.toFixed(decimals);
};
