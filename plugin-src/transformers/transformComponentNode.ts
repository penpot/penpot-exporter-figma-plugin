import { transformDimensionAndPosition } from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';

import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

export const transformComponentNode = async (
  node: ComponentNode,
  baseX: number,
  baseY: number
): Promise<ComponentShape> => {
  return {
    type: 'component',
    name: node.name,
    path: '',
    ...(await transformChildren(node, baseX + node.x, baseY + node.y)),
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
