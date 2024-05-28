import {
  transformBlend,
  transformDimension,
  transformEffects,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformText
} from '@plugin/transformers/partials';

import { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformTextNode = async (
  node: TextNode,
  baseX: number,
  baseY: number,
  baseRotation: number
): Promise<TextShape> => {
  return {
    type: 'text',
    name: node.name,
    ...(await transformText(node)),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseX, baseY, baseRotation),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...(await transformStrokes(node))
  };
};
