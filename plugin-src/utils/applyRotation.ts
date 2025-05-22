import {
  ClosePathCommand,
  Command,
  CurveToCommand,
  HorizontalLineToCommand,
  VerticalLineToCommand
} from 'svg-path-parser';

import { Point } from '@ui/lib/types/utils/point';

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
  command: Command,
  transform: Transform,
  boundingBox: Rect
): Command => {
  if (isHorizontalLineTo(command)) {
    return command;
  }
  if (isVerticalLineTo(command)) {
    return command;
  }
  if (isClosePath(command)) {
    return command;
  }

  const rotated = applyRotation({ x: command.x, y: command.y }, transform, boundingBox);

  if (isCurveTo(command)) {
    const curve1 = applyRotation({ x: command.x1, y: command.y1 }, transform, boundingBox);
    const curve2 = applyRotation({ x: command.x2, y: command.y2 }, transform, boundingBox);

    command.x1 = curve1.x;
    command.y1 = curve1.y;
    command.x2 = curve2.x;
    command.y2 = curve2.y;
  }

  command.x = rotated.x;
  command.y = rotated.y;

  return command;
};

export const applyInverseRotation = (
  point: Point,
  transform: Transform,
  boundingBox: Rect
): Point => applyRotation(point, inverseMatrix(transform), boundingBox);

export const getRotation = (transform: Transform): number =>
  Math.acos(transform[0][0]) * (180 / Math.PI);

export const isTransformed = (transform: Transform, boundingBox: Rect | null): boolean => {
  if (!boundingBox) {
    return false;
  }

  return transform[0][2] !== boundingBox.x || transform[1][2] !== boundingBox.y;
};

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

const isCurveTo = (command: Command): command is CurveToCommand => command.command === 'curveto';

const isHorizontalLineTo = (command: Command): command is HorizontalLineToCommand =>
  command.command === 'horizontal lineto';

const isVerticalLineTo = (command: Command): command is VerticalLineToCommand =>
  command.command === 'vertical lineto';

const isClosePath = (command: Command): command is ClosePathCommand =>
  command.command === 'closepath';
