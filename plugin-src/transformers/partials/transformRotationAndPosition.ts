import { applyInverseRotation, hasRotation } from '@plugin/utils';

import { ShapeBaseAttributes, ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

export const transformRotationAndPosition = (
  node: LayoutMixin,
  baseX: number,
  baseY: number,
  baseRotation: number
): Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> &
  Pick<ShapeGeomAttributes, 'x' | 'y'> => {
  const rotation = node.rotation + baseRotation;
  const x = node.x + baseX;
  const y = node.y + baseY;

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

  console.log(node.id, node.name, node.absoluteTransform);

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
