import {
  transformBlend,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { RectShape } from '@ui/lib/types/shapes/rectShape';

export const transformRectangleNode = async (
  node: RectangleNode,
  baseX: number,
  baseY: number
): Promise<RectShape> => {
  return {
    type: 'rect',
    name: node.name,
    ...transformRotationAndPosition(node, baseX, baseY),
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimension(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node)
  };
};
