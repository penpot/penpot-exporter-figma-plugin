import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';

export const transformDimensionAndPosition = (
  node: DimensionAndPositionMixin,
  baseX: number,
  baseY: number
): ShapeGeomAttributes => {
  return {
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height
  };
};
