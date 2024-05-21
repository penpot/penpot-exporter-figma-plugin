import { transformMaskChildren } from '@plugin/transformers/partials/transformMaskChildren';

import { Children } from '@ui/lib/types/utils/children';

export const transformChildren = async (
  node: ChildrenMixin,
  baseX: number = 0,
  baseY: number = 0
): Promise<Children> => {
  return {
    children: await transformMaskChildren(node.children, baseX, baseY)
  };
};
