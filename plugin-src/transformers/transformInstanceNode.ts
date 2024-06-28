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

import { ComponentInstance, ComponentTextPropertyOverride } from '@ui/types';

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
  if (!isOrphan) {
    registerTextVariableOverrides(node, primaryComponent);
    if (node.overrides.length > 0) {
      node.overrides.forEach(override => overrides.set(override.id, override.overriddenFields));
    }
    nodeOverrides = transformOverrides(node);
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
      overrides.set(textNode.id, ['text']);
    });
  }
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
