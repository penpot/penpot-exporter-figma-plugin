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
  node: InstanceNode,
  baseRotation: number
): Promise<ComponentInstance | undefined> => {
  const mainComponent = await node.getMainComponentAsync();

  if (mainComponent === null || isUnprocessableComponent(mainComponent)) {
    return;
  }

  if (isExternalComponent(mainComponent)) {
    registerExternalComponents(mainComponent);
  }

  registerTextVariableOverrides(node, mainComponent);

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

const registerExternalComponents = (mainComponent: ComponentNode): void => {
  let component: ComponentSetNode | ComponentNode = mainComponent;

  if (component.parent?.type === 'COMPONENT_SET') {
    component = component.parent;
  }

  if (remoteComponentLibrary.get(component.id) !== undefined) {
    return;
  }

  remoteComponentLibrary.register(component.id, component);
};

const getComponentPropertyDefinitions = (
  mainComponent: ComponentNode
): ComponentPropertyDefinitions => {
  let component: ComponentSetNode | ComponentNode = mainComponent;

  if (component.parent?.type === 'COMPONENT_SET') {
    component = component.parent;
  }

  return component.componentPropertyDefinitions;
};

const registerTextVariableOverrides = (node: InstanceNode, mainComponent: ComponentNode) => {
  const propertyDefinitions = new Map(
    Object.entries(getComponentPropertyDefinitions(mainComponent)).filter(
      ([_, value]) => value.type === 'TEXT'
    )
  );

  const nodeComponentProperties = new Map(
    Object.entries(node.componentProperties).filter(([_, value]) => value.type === 'TEXT')
  );

  if (propertyDefinitions.size === 0 || nodeComponentProperties.size === 0) {
    return;
  }

  const mergedOverridden = Array.from(propertyDefinitions.entries())
    .map(([key, value]) => {
      const nodeValue = nodeComponentProperties.get(key);
      return {
        id: key,
        ...value,
        value: nodeValue ? nodeValue.value : value.defaultValue
      };
    })
    .filter(value => value.value !== value.defaultValue);

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
