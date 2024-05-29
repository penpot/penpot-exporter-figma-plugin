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
    figmaId: node.id,
    name: node.name,
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node)
  };
};
