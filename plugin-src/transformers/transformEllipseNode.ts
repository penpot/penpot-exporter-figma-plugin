import {
  transformBlend,
  transformConstraints,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import type { CircleShape } from '@ui/lib/types/shapes/circleShape';

export const transformEllipseNode = (node: EllipseNode): CircleShape => {
  return {
    type: 'circle',
    name: node.name,
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformConstraints(node),
    ...transformOverrides(node)
  };
};
