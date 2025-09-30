import type { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

export const transformDimension = (
  node: DimensionAndPositionMixin
): Pick<ShapeGeomAttributes, 'width' | 'height'> => {
  return {
    width: node.width,
    height: node.height
  };
};

export const transformDimensionAndPosition = (
  node: DimensionAndPositionMixin
): ShapeGeomAttributes => {
  return {
    x: node.absoluteTransform[0][2],
    y: node.absoluteTransform[1][2],
    width: node.width,
    height: node.height
  };
};
