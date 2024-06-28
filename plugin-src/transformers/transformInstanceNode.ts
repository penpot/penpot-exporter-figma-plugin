import { overrides } from '@plugin/libraries';
import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { ComponentInstance } from '@ui/types';

export const transformInstanceNode = async (
  node: InstanceNode
): Promise<ComponentInstance | undefined> => {
  const mainComponent = await node.getMainComponentAsync();
  if (mainComponent === null) {
    return;
  }

  const primaryComponent = getPrimaryComponent(mainComponent);
  const isOrphan = isOrphanInstance(primaryComponent);
  let nodeOverrides = {};
  if (!isOrphan && node.overrides.length > 0) {
    node.overrides.forEach(override => overrides.set(override.id, override.overriddenFields));
    nodeOverrides = transformOverrides(node);
  }

  if (node.visible !== mainComponent.visible) {
    overrides.set(node.id, [...(overrides.get(node.id) ?? []), 'visible']);
  }
  if (node.locked !== mainComponent.locked) {
    overrides.set(node.id, [...(overrides.get(node.id) ?? []), 'locked']);
  }

  return {
    type: 'instance',
    name: node.name,
    mainComponentFigmaId: mainComponent.id,
    isComponentRoot: isComponentRoot(node),
    showContent: !node.clipsContent,
    isOrphan,
    ...transformFigmaIds(node),
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
    ...(await transformChildren(node)),
    ...nodeOverrides
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
