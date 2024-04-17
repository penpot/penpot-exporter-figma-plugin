import {
  transformBlend,
  transformDimensionAndPosition,
  transformFills,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { CircleShape } from '@ui/lib/types/circle/circleShape';

export const transformEllipseNode = (
  node: EllipseNode,
  baseX: number,
  baseY: number
): CircleShape => {
  return {
    type: 'circle',
    name: node.name,
    ...transformFills(node),
    ...transformStrokes(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
