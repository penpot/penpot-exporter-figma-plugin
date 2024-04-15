import { transformDimensionAndPosition } from '@plugin/transformers/partials';
import { translateBlendMode, translateFills } from '@plugin/translators';

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
    blendMode: translateBlendMode(node.blendMode),
    opacity: !node.visible ? 0 : node.opacity, //@TODO: check this. If we use the property hidden and it's hidden, it won't export
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
