import { GroupShape } from '@ui/lib/types/group/groupShape';

import { transformSceneNode } from './transformSceneNode';

export const transformGroupNode = async (
  node: GroupNode,
  baseX: number,
  baseY: number
): Promise<GroupShape> => {
  return {
    type: 'group',
    name: node.name,
    children: await Promise.all(node.children.map(child => transformSceneNode(child, baseX, baseY)))
  };
};
