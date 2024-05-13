import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
  transformProportion,
  transformSceneNode,
  transformStrokes,
  transformText
} from '@plugin/transformers/partials';

import { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformTextNode = async (
  node: TextNode,
  baseX: number,
  baseY: number
): Promise<TextShape> => {
  return {
    type: 'text',
    name: node.name,
    ...(await transformText(node)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...(await transformStrokes(node))
  };
};
