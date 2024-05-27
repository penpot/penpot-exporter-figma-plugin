import { translateMaskChildren, translateNonMaskChildren } from '@plugin/translators';

import { Children } from '@ui/lib/types/utils/children';

const isMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

export const transformChildren = async (
  node: ChildrenMixin,
  baseX: number = 0,
  baseY: number = 0
): Promise<Children> => {
  const maskIndex = node.children.findIndex(isMask);

  return {
    children:
      maskIndex !== -1
        ? await translateMaskChildren(node.children, maskIndex, baseX, baseY)
        : await translateNonMaskChildren(node.children, baseX, baseY)
  };
};
