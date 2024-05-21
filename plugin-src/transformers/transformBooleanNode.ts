import { transformChildren } from '@plugin/transformers/partials';

import { BoolShape } from '@ui/lib/types/shapes/boolShape';

export const transformBooleanNode = async (
  node: BooleanOperationNode,
  baseX: number,
  baseY: number
): Promise<BoolShape> => {
  return {
    type: 'bool',
    name: node.name,
    boolType: 'difference',
    ...(await transformChildren(node, baseX, baseY))
  };
};
