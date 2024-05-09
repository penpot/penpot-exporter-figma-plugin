import { transformSceneNode } from '@plugin/transformers';

import { PenpotNode } from '@ui/lib/types/penpotNode';
import { Children } from '@ui/lib/types/utils/children';

export const transformChildren = async (
  node: ChildrenMixin,
  baseX: number = 0,
  baseY: number = 0
): Promise<Children> => {
  const children: PenpotNode[] = [];
  for (const child of node.children) {
    const sceneNode = await transformSceneNode(child, baseX, baseY);
    if (sceneNode) {
      children.push(sceneNode);
    }
  }

  return {
    children: children
  };
};
