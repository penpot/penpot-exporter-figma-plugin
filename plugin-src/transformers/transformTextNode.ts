import {
  transformBlend,
  transformConstraints,
  transformDimension,
  transformEffects,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformText,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';

import type { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformTextNode = (node: TextNode): TextShape => {
  return {
    type: 'text',
    name: node.name,
    ...transformIds(node),
    ...transformText(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformStrokes(node),
    ...transformConstraints(node),
    ...transformVariableConsumptionMap(node),
    ...transformOverrides(node)
  };
};
