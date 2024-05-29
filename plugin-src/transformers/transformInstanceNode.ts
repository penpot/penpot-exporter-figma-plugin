import { transformDimensionAndPosition } from '@plugin/transformers/partials';

import { InstanceShape } from '@ui/lib/types/shapes/circleShape';

export const transformEllipseNode = async (
  node: EllipseNode,
  baseX: number,
  baseY: number
): Promise<InstanceShape> => {
  console.log(node);

  return {
    type: 'instance',
    name: node.name,
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
