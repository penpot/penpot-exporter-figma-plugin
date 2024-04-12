import { FrameShape } from '../../ui/lib/types/frame/frameShape';
import { translateFills } from '../translators/translateFills';
import { transformSceneNode } from './transformSceneNode';

export const transformFrameNode = async (
  node: FrameNode,
  baseX: number,
  baseY: number
): Promise<FrameShape> => {
  return {
    type: 'frame',
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills, node.width, node.height),
    children: await Promise.all(
      node.children.map(child => transformSceneNode(child, baseX + node.x, baseY + node.y))
    )
  };
};
