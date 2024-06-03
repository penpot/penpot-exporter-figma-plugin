import {
  transformBlend,
  transformChildren,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { ComponentInstance } from '@ui/types';

export const transformInstanceNode = async (
  node: InstanceNode,
  baseX: number,
  baseY: number
): Promise<ComponentInstance | undefined> => {
  const mainComponent = await node.getMainComponentAsync();

  if (node.name === 'dropdown') {
    console.log(node, mainComponent);
  }

  /**
   * We do not want to process component instances in the following scenarios:
   *
   * 1. If the component does not have a main component.
   * 2. If the component comes from an external design system.
   * 3. If th component does not have a parent. (it's been removed)
   */
  if (!mainComponent || mainComponent.remote || mainComponent.parent === null) {
    return;
  }

  /**
   * Main component can be in a ComponentSet removed from the page or external design system.
   */
  if (
    mainComponent.parent?.type === 'COMPONENT_SET' &&
    (mainComponent.parent.parent === null || mainComponent.parent.remote)
  ) {
    return;
  }

  return {
    type: 'instance',
    name: node.name,
    mainComponentFigmaId: mainComponent.id,
    isComponentRoot: isComponentRoot(node),
    ...transformFigmaIds(node),
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...(await transformChildren(node, baseX + node.x, baseY + node.y))
  };
};

const isComponentRoot = (node: InstanceNode): boolean => {
  let parent = node.parent;
  while (parent !== null) {
    if (parent.type === 'COMPONENT' || parent.type === 'INSTANCE') {
      return false;
    }
    parent = parent.parent;
  }
  return true;
};
