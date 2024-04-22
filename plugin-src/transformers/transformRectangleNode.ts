import {
  transformBlend,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { RectShape } from '@ui/lib/types/rect/rectShape';

export const transformRectangleNode = (
  node: RectangleNode,
  baseX: number,
  baseY: number
): RectShape => {
  return {
    type: 'rect',
    name: node.name,
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node)
  };
};
