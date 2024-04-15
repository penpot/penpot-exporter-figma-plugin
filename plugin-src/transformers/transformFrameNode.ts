import { transformDimensionAndPosition } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';

import { FrameShape } from '@ui/lib/types/frame/frameShape';

import { transformSceneNode } from '.';

export const transformFrameNode = async (
  node: FrameNode,
  baseX: number,
  baseY: number
): Promise<FrameShape> => {
  return {
    type: 'frame',
    name: node.name,
    fills: translateFills(node.fills, node.width, node.height),
    children: await Promise.all(
      node.children.map(child => transformSceneNode(child, baseX + node.x, baseY + node.y))
    ),
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
