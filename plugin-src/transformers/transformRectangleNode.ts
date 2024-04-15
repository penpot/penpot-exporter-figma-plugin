import { transformBlend, transformDimensionAndPosition } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';

import { RectShape } from '@ui/lib/types/rect/rectShape';

export const transformRectangleNode = (
  node: RectangleNode,
  baseX: number,
  baseY: number
): RectShape => {
  return {
    type: 'rect',
    name: node.name,
    fills: translateFills(node.fills, node.width, node.height),
    ...transformBlend(node),
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
