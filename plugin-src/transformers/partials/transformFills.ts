import { translateFills } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformFills = async (
  node: MinimalFillsMixin & DimensionAndPositionMixin
): Promise<Partial<ShapeAttributes>> => {
  return {
    fills: await translateFills(node.fills, node.width, node.height)
  };
};
