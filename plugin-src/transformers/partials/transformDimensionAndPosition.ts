import { getBoundingBox } from '@plugin/utils';

import { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

export const transformDimension = (
  node: DimensionAndPositionMixin
): Pick<ShapeGeomAttributes, 'width' | 'height'> => {
  return {
    width: node.width,
    height: node.height
  };
};

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

export const transformDimensionAndPositionFromVectorPath = (
  vectorPath: VectorPath,
  baseX: number,
  baseY: number
): ShapeGeomAttributes => {
  const boundingBox = getBoundingBox(vectorPath);

  return {
    x: boundingBox.x1 + baseX,
    y: boundingBox.y1 + baseY,
    width: boundingBox.x2 - boundingBox.x1,
    height: boundingBox.y2 - boundingBox.y1
  };
};
