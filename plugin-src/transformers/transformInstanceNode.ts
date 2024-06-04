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
import { transformComponentNode } from '@plugin/transformers/transformComponentNode';
import { transformFrameNode } from '@plugin/transformers/transformFrameNode';

import { ComponentInstance } from '@ui/types';

export const transformInstanceNode = async (
  node: InstanceNode,
  baseX: number,
  baseY: number,
  remote: boolean = false
): Promise<ComponentInstance | undefined> => {
  const mainComponent = await node.getMainComponentAsync();

  if (mainComponent === null) {
    return;
  }

  const isRemoteComponent = isUnprocessableComponent(mainComponent);

  if (isRemoteComponent) {
    if (mainComponent.parent?.type === 'COMPONENT_SET') {
      await transformFrameNode(mainComponent.parent, baseX, baseY, true);
    }

    if (mainComponent.remote || mainComponent.parent === null) {
      await transformComponentNode(mainComponent, baseX, baseY, true);
    }
  }

  return {
    type: 'instance',
    name: node.name,
    mainComponentFigmaId: mainComponent.id,
    isComponentRoot: isComponentRoot(node),
    isRemoteComponent,
    ...transformFigmaIds(node),
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...(await transformChildren(node, baseX + node.x, baseY + node.y, remote || isRemoteComponent))
  };
};

/**
 * We do not want to process component instances in the following scenarios:
 *
 * 1. If the component comes from an external design system.
 * 2. If the component does not have a parent. (it's been removed)
 * 3. Main component can be in a ComponentSet (the same logic applies to the parent).
 */
const isUnprocessableComponent = (mainComponent: ComponentNode): boolean => {
  return (
    mainComponent.remote ||
    mainComponent.parent === null ||
    (mainComponent.parent?.type === 'COMPONENT_SET' &&
      (mainComponent.parent.parent === null || mainComponent.parent.remote))
  );
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
