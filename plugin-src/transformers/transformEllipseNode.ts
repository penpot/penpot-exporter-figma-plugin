import {
  transformBlend,
  transformConstraints,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { CircleShape } from '@ui/lib/types/shapes/circleShape';

export const transformEllipseNode = (
  node: EllipseNode,
  baseX: number,
  baseY: number
): CircleShape => {
  return {
    type: 'circle',
    name: node.name,
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformConstraints(node)
  };
};
