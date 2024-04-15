import { transformBlend, transformDimensionAndPosition } from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/group/groupShape';

export const transformGroupNode = async (
  node: GroupNode,
  baseX: number,
  baseY: number
): Promise<GroupShape> => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...(await transformChildren(node, baseX, baseY)),
    ...transformBlend(node)
  };
};
