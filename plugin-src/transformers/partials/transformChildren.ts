import { translateChildren, translateMaskChildren } from '@plugin/translators';

import { Children } from '@ui/lib/types/utils/children';

const nodeActsAsMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

const nodeIsLayoutWithItemReverseZIndex = (node: ChildrenMixin): boolean => {
  return !!('itemReverseZIndex' in node && node.itemReverseZIndex);
};

export const transformChildren = async (
  node: ChildrenMixin,
  baseX: number = 0,
  baseY: number = 0,
  zIndex: number = 0
): Promise<Children> => {
  const maskIndex = node.children.findIndex(nodeActsAsMask);
  const containsMask = maskIndex !== -1;
  const itemReverseZIndex = nodeIsLayoutWithItemReverseZIndex(node);
  return {
    children: containsMask
      ? await translateMaskChildren(
          node.children,
          maskIndex,
          baseX,
          baseY,
          zIndex,
          itemReverseZIndex
        )
      : await translateChildren(node.children, baseX, baseY, zIndex, itemReverseZIndex)
  };
};
