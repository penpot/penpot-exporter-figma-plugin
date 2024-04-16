import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills, translateStrokes } from '@plugin/translators';

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
    strokes: translateStrokes(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
