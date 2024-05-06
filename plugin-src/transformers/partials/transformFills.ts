import { translateFills } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformFills = (
  node: MinimalFillsMixin & DimensionAndPositionMixin
): Partial<ShapeAttributes> => {
  return {
    fills: translateFills(node.fills, node.width, node.height)
  };
};
