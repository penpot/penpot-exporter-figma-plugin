import {
  transformBlend,
  transformDimension,
  transformEffects,
  transformFills,
  transformProportion,
  transformRotationAndPosition,
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
    figmaId: node.id,
    name: node.name,
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
