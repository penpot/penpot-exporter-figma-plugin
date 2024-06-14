import {
  transformBlend,
  transformConstraints,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformLayoutAttributes,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformText
} from '@plugin/transformers/partials';

import { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformTextNode = (node: TextNode, baseRotation: number): TextShape => {
  return {
    type: 'text',
    name: node.name,
    ...transformFigmaIds(node),
    ...transformText(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseRotation),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformStrokes(node),
    ...transformConstraints(node)
  };
};
