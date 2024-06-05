import { remoteComponentLibrary } from '@plugin/RemoteComponentLibrary';
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

  if (mainComponent === null || isUnprocessableComponent(mainComponent)) {
    return;
  }

  if (
    isExternalComponent(mainComponent) &&
    remoteComponentLibrary.get(mainComponent.id) === undefined
  ) {
    remoteComponentLibrary.register(mainComponent.id, mainComponent);
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

const isExternalComponent = (mainComponent: ComponentNode): boolean => {
  return (
    mainComponent.remote ||
    (mainComponent.parent?.type === 'COMPONENT_SET' && mainComponent.parent.remote)
  );
};

/**
 * We do not want to process component instances in the following scenarios:
 *
 * 1. If the component does not have a parent. (it's been removed)
 * 2. Main component can be in a ComponentSet (the same logic applies to the parent).
 */
const isUnprocessableComponent = (mainComponent: ComponentNode): boolean => {
  return (
    (mainComponent.parent === null && !mainComponent.remote) ||
    (mainComponent.parent?.type === 'COMPONENT_SET' &&
      mainComponent.parent.parent === null &&
      !mainComponent.parent.remote)
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
