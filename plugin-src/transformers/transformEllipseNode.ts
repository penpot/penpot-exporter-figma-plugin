import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { CircleShape } from '@ui/lib/types/shapes/circleShape';

export const transformEllipseNode = async (
  node: EllipseNode,
  baseX: number,
  baseY: number
): Promise<CircleShape> => {
  return {
    type: 'circle',
    name: node.name,
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
