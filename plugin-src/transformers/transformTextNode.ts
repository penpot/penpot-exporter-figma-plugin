import {
  transformBlend,
  transformConstraints,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformProportion,
  transformSceneNode,
  transformStrokes,
  transformText
} from '@plugin/transformers/partials';

import { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformTextNode = (node: TextNode, baseX: number, baseY: number): TextShape => {
  return {
    type: 'text',
    name: node.name,
    ...transformFigmaIds(node),
    ...transformText(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformStrokes(node),
    ...transformConstraints(node)
  };
};
