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

  /**
   * We do not want to process component instances in the following scenarios:
   *
   * 1. If the component does not have a main component.
   * 2. If the component does not have parent (it comes from an external design system).
   * 3. If the component is inside a component set, (it is a variant component).
   */
  if (
    !mainComponent ||
    mainComponent.parent === null ||
    mainComponent.parent.type === 'COMPONENT_SET'
  ) {
    return;
  }

  return {
    type: 'instance',
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
