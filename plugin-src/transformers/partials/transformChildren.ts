import { Children } from '@ui/lib/types/utils/children';

import { transformSceneNode } from '../transformSceneNode';

export const transformChildren = async (
  node: ChildrenMixin,
  baseX: number = 0,
  baseY: number = 0
): Promise<Children> => {
  return {
    children: await Promise.all(node.children.map(child => transformSceneNode(child, baseX, baseY)))
  };
};
