import {
  transformBlend,
  transformConstraints,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformLayoutAttributes,
  transformProportion,
  transformSceneNode,
  transformStrokes,
  transformText
} from '@plugin/transformers/partials';

import { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformTextNode = (node: TextNode): TextShape => {
  return {
    type: 'text',
    name: node.name,
    ...transformFigmaIds(node),
    ...transformText(node),
    ...transformDimensionAndPosition(node),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformStrokes(node),
    ...transformConstraints(node)
  };
};
