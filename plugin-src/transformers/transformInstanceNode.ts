import { overridesLibrary } from '@plugin/OverridesLibrary';
import { remoteComponentLibrary } from '@plugin/RemoteComponentLibrary';
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
  if (isUnprocessableComponent(primaryComponent)) {
    return;
  }

  if (primaryComponent.remote) {
    registerExternalComponents(primaryComponent);
  }

  if (node.overrides.length > 0) {
    node.overrides.forEach(override =>
      overridesLibrary.register(override.id, override.overriddenFields)
    );
  }

  if (node.visible !== mainComponent.visible) {
    overridesLibrary.register(node.id, ['visible']);
  }
  if (node.locked !== mainComponent.locked) {
    overridesLibrary.register(node.id, ['locked']);
  }
  if (node.id === 'I1:360;304:2177') {
    console.log(node, mainComponent);
  }

  return {
    type: 'instance',
    name: node.name,
    mainComponentFigmaId: mainComponent.id,
    isComponentRoot: isComponentRoot(node),
    showContent: !node.clipsContent,
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
    ...transformOverrides(node)
  };
};

const getPrimaryComponent = (mainComponent: ComponentNode): ComponentNode | ComponentSetNode => {
  if (mainComponent.parent?.type === 'COMPONENT_SET') {
    return mainComponent.parent;
  }

  return mainComponent;
};

const registerExternalComponents = (primaryComponent: ComponentNode | ComponentSetNode): void => {
  if (remoteComponentLibrary.get(primaryComponent.id) !== undefined) {
    return;
  }

  remoteComponentLibrary.register(primaryComponent.id, primaryComponent);
};

/**
 * We do not want to process component instances in the following scenarios:
 *
 * 1. If the component does not have a parent. (it's been removed)
 * 2. Main component can be in a ComponentSet (the same logic applies to the parent).
 */
const isUnprocessableComponent = (primaryComponent: ComponentNode | ComponentSetNode): boolean => {
  return primaryComponent.parent === null && !primaryComponent.remote;
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
