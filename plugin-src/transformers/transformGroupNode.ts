import { transformSceneNode as mainTransformSceneNode } from '@plugin/transformers';
import {
  transformBlend,
  transformChildren,
  transformDimensionAndPosition,
  transformEffects,
  transformSceneNode
} from '@plugin/transformers/partials';

import { PenpotNode } from '@ui/lib/types/penpotNode';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';

export const transformGroupNode = async (
  node: GroupNode,
  baseX: number,
  baseY: number
): Promise<GroupShape> => {
  const splitMask = splitChildrenByMask(node.children);
  if (splitMask.length === 1) {
    return {
      ...transformGroupNodeLike(node, baseX, baseY, isMaskedGroup(splitMask[0])),
      ...(await transformChildren({ children: splitMask[0] }, baseX, baseY))
    };
  }

  const children = await transformMaskChildren(node, splitMask, baseX, baseY);
  return {
    ...transformGroupNodeLike(node, baseX, baseY),
    children
  };
};

export const transformGroupNodeLike = (
  node: BaseNodeMixin & DimensionAndPositionMixin & BlendMixin & SceneNodeMixin & MinimalBlendMixin,
  baseX: number,
  baseY: number,
  maskedGroup: boolean = false
): GroupShape => {
  return {
    type: 'group',
    name: node.name,
    maskedGroup,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};

const transformMaskChildren = async (
  node: GroupNode,
  splitMask: SceneNode[][],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  const maskChildren: PenpotNode[] = [];

  for (const children of splitMask) {
    if (isMaskedGroup(children)) {
      maskChildren.push({
        ...transformGroupNodeLike(node, baseX, baseY, true),
        ...(await transformChildren({ children }, baseX, baseY))
      });
    } else {
      const transformedChildren = await Promise.all(
        children.map(child => mainTransformSceneNode(child, baseX, baseY))
      );
      maskChildren.push(...(transformedChildren.filter(Boolean) as PenpotNode[]));
    }
  }
  return maskChildren;
};

const isMaskedGroup = (children: SceneNode[]): boolean => {
  return children.some(child => 'isMask' in child && child.isMask);
};

const splitChildrenByMask = (children: ReadonlyArray<SceneNode>): SceneNode[][] => {
  const groups: SceneNode[][] = [];
  let currentGroup: SceneNode[] = [];

  children.forEach(child => {
    if ('isMask' in child && child.isMask) {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [];
    }
    currentGroup.push(child);
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};
