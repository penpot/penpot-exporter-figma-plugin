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
    mainInstanceId: '30dd1e1f-9615-4481-85e6-98bced410697',
    mainInstancePage: '30dd1e1f-9615-4481-85e6-98bced410697',
    mainInstance: true,
    componentRoot: true,
    ...(await transformChildren(node, baseX + node.x, baseY + node.y)),
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
