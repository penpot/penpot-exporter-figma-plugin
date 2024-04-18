import { ShapeGeomAttributes } from '@ui/lib/types/shape/shapeGeomAttributes';

export const transformDimensionAndPosition = (
  node: DimensionAndPositionMixin,
  baseX: number,
  baseY: number
): ShapeGeomAttributes => {
  return {
    x: node.absoluteBoundingBox?.x ?? 0,
    y: node.absoluteBoundingBox?.y ?? 0,
    width: node.width,
    height: node.height
  };
};
