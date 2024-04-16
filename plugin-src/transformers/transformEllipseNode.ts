import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills, translateStrokes } from '@plugin/translators';

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
    strokes: translateStrokes(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
