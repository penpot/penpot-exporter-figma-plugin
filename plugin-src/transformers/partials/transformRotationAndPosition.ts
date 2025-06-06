import { translateRotation, translateZeroRotation } from '@plugin/translators';
import { applyInverseRotation, getRotation, isTransformed } from '@plugin/utils';

import { ShapeBaseAttributes, ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

export const transformRotation = (
  node: LayoutMixin
): Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> => {
  const rotation = getRotation(node.absoluteTransform);

  return translateRotation(node.absoluteTransform, rotation);
};

export const transformRotationAndPosition = (
  node: SceneNode
): Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> &
  Pick<ShapeGeomAttributes, 'x' | 'y'> => {
  const x = node.absoluteTransform[0][2];
  const y = node.absoluteTransform[1][2];
  const rotation = getRotation(node.absoluteTransform);

  if (
    !node.absoluteBoundingBox ||
    !isTransformed(node.absoluteTransform, node.absoluteBoundingBox)
  ) {
    return {
      x,
      y,
      ...translateZeroRotation()
    };
  }

  const referencePoint = applyInverseRotation(
    { x, y },
    node.absoluteTransform,
    node.absoluteBoundingBox
  );

  return {
    ...referencePoint,
    ...translateRotation(node.absoluteTransform, rotation)
  };
};
