import {
  transformBlend,
  transformConstraints,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformText
} from '@plugin/transformers/partials';

import { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformTextNode = (node: TextNode): TextShape => {
  console.log(transformText(node));
  return {
    type: 'text',
    name: node.name,
    ...transformFigmaIds(node),
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
    ...transformOverrides(node)
  };
};
