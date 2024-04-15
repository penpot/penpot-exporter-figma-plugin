import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
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
    transform: {
      a: node.relativeTransform[0][0],
      b: -node.relativeTransform[0][1],
      c: node.relativeTransform[1][0],
      d: -node.relativeTransform[1][1],
      e: 0,
      f: -0
    },
    rotation: node.rotation < 0 ? node.rotation + 360 : node.rotation,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
