import { transformDimensionAndPosition, transformSceneNode } from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';
import { translateFills, translateStrokes } from '@plugin/translators';

import { FrameShape } from '@ui/lib/types/frame/frameShape';

export const transformFrameNode = async (
  node: FrameNode,
  baseX: number,
  baseY: number
): Promise<FrameShape> => {
  return {
    type: 'frame',
    name: node.name,
    fills: translateFills(node.fills, node.width, node.height),
    strokes: translateStrokes(node),
    ...(await transformChildren(node, baseX, baseY)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node)
  };
};
