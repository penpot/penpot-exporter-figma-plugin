import {
  transformBlend,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';

import type { RectShape } from '@ui/lib/types/shapes/rectShape';

export const transformRectangleNode = (node: RectangleNode): RectShape => {
  return {
    type: 'rect',
    name: node.name,
    ...transformIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformCornerRadius(node),
    ...transformConstraints(node),
    ...transformVariableConsumptionMap(node),
    ...transformOverrides(node)
  };
};
