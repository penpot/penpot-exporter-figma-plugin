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

  const transformedChildren = await Promise.all(
    children.map(child => transformSceneNode(child, baseX, baseY))
  );

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const transformedChild = transformedChildren[i];

    if (!transformedChild) {
      continue;
    }

    if (isMask(child)) {
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

const isMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};
