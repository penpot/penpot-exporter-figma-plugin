import { translateFills } from '@plugin/translators/fills';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformFills = async (
  node: MinimalFillsMixin & DimensionAndPositionMixin
): Promise<Pick<ShapeAttributes, 'fills'>> => {
  return {
    fills: await translateFills(node.fills)
  };
};
