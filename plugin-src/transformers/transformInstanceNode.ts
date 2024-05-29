import { transformDimensionAndPosition } from '@plugin/transformers/partials';

import { InstanceShape } from '@ui/lib/types/shapes/instanceShape';

export const transformInstanceNode = async (
  node: InstanceNode,
  baseX: number,
  baseY: number
): Promise<InstanceShape> => {
  const mainComponent = await node.getMainComponentAsync();

  console.log(node);
  console.log(mainComponent);

  return {
    type: 'instance',
    componentId: '07e70c15-0f38-8bfc-ba65-f0ec85dc2812',
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
