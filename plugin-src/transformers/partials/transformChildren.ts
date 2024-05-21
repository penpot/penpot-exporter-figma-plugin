import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';

import { PenpotNode } from '@ui/lib/types/penpotNode';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { Children } from '@ui/lib/types/utils/children';

export const transformChildren = async (
  node: ChildrenMixin,
  baseX: number = 0,
  baseY: number = 0
): Promise<Children> => {
  return {
    children: await transformChildrenWithMask(node.children, baseX, baseY)
  };
};

const transformChildrenWithMask = async (
  children: readonly SceneNode[],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  const splitChildren: PenpotNode[] = [];
  let currentGroup: Partial<GroupShape> | null = null;

  for (const child of children) {
    const transformedChild = await transformSceneNode(child, baseX, baseY);

    if ('isMask' in child && child.isMask) {
      if (currentGroup?.children?.length) {
        splitChildren.push(currentGroup as GroupShape);
      }
      currentGroup = {
        ...transformGroupNodeLike(child, baseX, baseY),
        children: [],
        maskedGroup: true
      };
    }

    if (transformedChild) {
      if (currentGroup) {
        currentGroup.children?.push(transformedChild);
      } else {
        splitChildren.push(transformedChild);
      }
    }
  }

  if (currentGroup?.children?.length) {
    splitChildren.push(currentGroup as GroupShape);
  }

  return splitChildren;
};
