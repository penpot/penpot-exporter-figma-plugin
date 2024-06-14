import { applyInverseRotation, hasRotation } from '@plugin/utils';

import { ShapeBaseAttributes, ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

export const transformRotationAndPosition = (
  node: LayoutMixin,
  baseRotation: number
): Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> &
  Pick<ShapeGeomAttributes, 'x' | 'y'> => {
  const rotation = node.rotation + baseRotation;
  const x = node.absoluteTransform[0][2];
  const y = node.absoluteTransform[1][2];

  if (!hasRotation(rotation) || !node.absoluteBoundingBox) {
    return {
      x,
      y,
      rotation,
      transform: undefined,
      transformInverse: undefined
    };
  }

  const referencePoint = applyInverseRotation(
    { x, y },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  return {
    ...referencePoint,
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
