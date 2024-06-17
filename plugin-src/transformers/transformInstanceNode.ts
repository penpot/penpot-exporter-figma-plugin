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

import { ComponentInstance, ComponentTextPropertyOverride } from '@ui/types';

export const transformInstanceNode = async (
  node: InstanceNode,
  baseRotation: number
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

  registerTextVariableOverrides(node, primaryComponent);

  if (node.overrides.length > 0) {
    node.overrides.forEach(override =>
      overridesLibrary.register(override.id, override.overriddenFields)
    );
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
    ...transformLayoutAttributes(node),
    ...transformCornerRadius(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseRotation),
    ...transformConstraints(node),
    ...transformAutoLayout(node),
    ...(await transformChildren(node, node.rotation + baseRotation)),
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

const getComponentTextPropertyOverrides = (
  node: InstanceNode,
  primaryComponent: ComponentNode | ComponentSetNode
): ComponentTextPropertyOverride[] => {
  try {
    const componentPropertyDefinitions = Object.entries(
      primaryComponent.componentPropertyDefinitions
    ).filter(([, value]) => value.type === 'TEXT');

    const instanceComponentProperties = new Map(
      Object.entries(node.componentProperties).filter(([, value]) => value.type === 'TEXT')
    );

    return componentPropertyDefinitions
      .map(([key, value]) => {
        const nodeValue = instanceComponentProperties.get(key);
        return {
          id: key,
          ...value,
          value: nodeValue ? nodeValue.value : value.defaultValue
        } as ComponentTextPropertyOverride;
      })
      .filter(({ value, defaultValue }) => value !== defaultValue);
  } catch (error) {
    return [];
  }
};

const registerTextVariableOverrides = (
  node: InstanceNode,
  primaryComponent: ComponentNode | ComponentSetNode
) => {
  const mergedOverridden = getComponentTextPropertyOverrides(node, primaryComponent);

  if (mergedOverridden.length > 0) {
    const textNodes = node
      .findChildren(child => child.type === 'TEXT')
      .filter(textNode => {
        const componentPropertyReference = textNode.componentPropertyReferences?.characters;
        return (
          componentPropertyReference &&
          mergedOverridden.some(property => property.id === componentPropertyReference)
        );
      });

    textNodes.forEach(textNode => {
      overridesLibrary.register(textNode.id, ['text']);
    });
  }
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
