import { overrides } from '@plugin/libraries';
import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformGrids,
  transformId,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';

import type { ComponentInstance } from '@ui/types';

export const transformInstanceNode = async (
  node: InstanceNode
): Promise<ComponentInstance | undefined> => {
  const mainComponent = await node.getMainComponentAsync();
  if (mainComponent === null) {
    return;
  }

  const primaryComponent = getPrimaryComponent(mainComponent);
  const isOrphan = isOrphanInstance(primaryComponent);

  if (!isOrphan && node.overrides.length > 0) {
    node.overrides.forEach(override => overrides.set(override.id, override.overriddenFields));
  }

  const fetchedOverrides = [...(overrides.get(node.id) ?? [])];
  if (node.visible !== mainComponent.visible) {
    fetchedOverrides.push('visible');
  }
  if (node.locked !== mainComponent.locked) {
    fetchedOverrides.push('locked');
  }
  overrides.set(node.id, fetchedOverrides);

  return {
    type: 'instance',
    name: node.name,
    mainComponentId: transformId(mainComponent),
    componentRoot: isComponentRoot(node),
    showContent: !node.clipsContent,
    isOrphan,
    ...transformIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node, true),
    ...transformCornerRadius(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformConstraints(node),
    ...transformAutoLayout(node),
    ...transformVariableConsumptionMap(node),
    ...transformGrids(node),
    ...(await transformChildren(node)),
    ...transformOverrides(node)
  };
};

const getPrimaryComponent = (mainComponent: ComponentNode): ComponentNode | ComponentSetNode => {
  if (mainComponent.parent?.type === 'COMPONENT_SET') {
    return mainComponent.parent;
  }

  return mainComponent;
};

const isOrphanInstance = (primaryComponent: ComponentNode | ComponentSetNode): boolean => {
  return primaryComponent.parent === null || primaryComponent.remote;
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
