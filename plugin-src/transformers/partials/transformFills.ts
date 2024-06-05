import { translateFills } from '@plugin/translators/fills';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformFills = (
  node: MinimalFillsMixin & DimensionAndPositionMixin
): Pick<ShapeAttributes, 'fills'> => {
  return {
    fills: translateFills(node.fills)
  };
};
