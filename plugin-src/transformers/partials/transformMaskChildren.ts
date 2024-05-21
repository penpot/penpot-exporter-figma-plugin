import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';

import { PenpotNode } from '@ui/lib/types/penpotNode';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';

export const transformMaskChildren = async (
  children: readonly SceneNode[],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  const splitChildren: PenpotNode[] = [];
  let currentGroup: Partial<GroupShape> | null = null;

  for (const child of children) {
    const transformedChild = await transformSceneNode(child, baseX, baseY);
    if (!transformedChild) {
      continue;
    }

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

    if (currentGroup) {
      currentGroup.children?.push(transformedChild);
    } else {
      splitChildren.push(transformedChild);
    }
  }

  if (currentGroup?.children?.length) {
    splitChildren.push(currentGroup as GroupShape);
  }

  return splitChildren;
};
