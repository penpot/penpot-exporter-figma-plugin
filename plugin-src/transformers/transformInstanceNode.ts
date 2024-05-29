import { transformChildren, transformDimensionAndPosition } from '@plugin/transformers/partials';

import { ComponentInstance } from '@ui/types';

export const transformInstanceNode = async (
  node: InstanceNode,
  baseX: number,
  baseY: number
): Promise<ComponentInstance | undefined> => {
  const mainComponent = await node.getMainComponentAsync();

  // If the component does not have parent it means that it comes from an external
  // design system, for now we do not support that kind of instances.
  if (!mainComponent || mainComponent.parent === null) {
    return;
  }

  return {
    type: 'instance',
    figmaId: node.id,
    mainComponentFigmaId: mainComponent.id,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...(await transformChildren(node, baseX + node.x, baseY + node.y))
  };
};
