import { transformBlend, transformDimensionAndPosition } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';

import { CircleShape } from '@ui/lib/types/circle/circleShape';

export const transformEllipseNode = (
  node: EllipseNode,
  baseX: number,
  baseY: number
): CircleShape => {
  return {
    type: 'circle',
    name: node.name,
    fills: translateFills(node.fills, node.width, node.height),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformBlend(node)
  };
};
