import { translateChildren, translateMaskChildren } from '@plugin/translators';

import { Children } from '@ui/lib/types/utils/children';

const nodeActsAsMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

export const transformChildren = async (
  node: ChildrenMixin,
  baseX: number = 0,
  baseY: number = 0,
  reverseChildrenOrder: boolean = false
): Promise<Children> => {
  const maskIndex = node.children.findIndex(nodeActsAsMask);
  const containsMask = maskIndex !== -1;
  const children = reverseChildrenOrder ? node.children.slice().reverse() : node.children;

  return {
    children: containsMask
      ? await translateMaskChildren(children, maskIndex, baseX, baseY)
      : await translateChildren(children, baseX, baseY)
  };
};
