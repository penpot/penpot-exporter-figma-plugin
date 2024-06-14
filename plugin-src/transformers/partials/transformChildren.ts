import { translateChildren, translateMaskChildren } from '@plugin/translators';

import { Children } from '@ui/lib/types/utils/children';

const nodeActsAsMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

export const transformChildren = async (
  node: ChildrenMixin,
  baseRotation: number = 0
): Promise<Children> => {
  const maskIndex = node.children.findIndex(nodeActsAsMask);
  const containsMask = maskIndex !== -1;

  return {
    children: containsMask
      ? await translateMaskChildren(node.children, maskIndex, baseRotation)
      : await translateChildren(node.children, baseRotation)
  };
};
