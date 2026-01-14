import { externalLibraries, overrides } from '@plugin/libraries';
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
  transformInstanceIds,
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

  const figmaFile = mainComponent.getPluginData('figmaFile');
  const isOrphan = isOrphanInstance(mainComponent);

  if (!isOrphan) {
    setOverrides(node, mainComponent);
  }

  return {
    type: 'instance',
    name: node.name,
    componentFile: isRemoteComponent(mainComponent, figmaFile)
      ? externalLibraries.get(figmaFile)
      : undefined,
    componentRoot: isComponentRoot(node),
    showContent: !node.clipsContent,
    isOrphan,
    ...transformInstanceIds(node, mainComponent),
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

const isOrphanInstance = (node: ComponentNode): boolean => {
  return node.parent === null && node.remote === false;
};

const isRemoteComponent = (node: ComponentNode, figmaFile: string): boolean => {
  return node.remote === true && externalLibraries.has(figmaFile);
};

const setOverrides = (node: InstanceNode, mainComponent: ComponentNode): void => {
  node.overrides.forEach(override => overrides.set(override.id, override.overriddenFields));

  const fetchedOverrides = [...(overrides.get(node.id) ?? [])];

  if (node.visible !== mainComponent.visible) {
    fetchedOverrides.push('visible');
  }

  if (node.locked !== mainComponent.locked) {
    fetchedOverrides.push('locked');
  }

  overrides.set(node.id, fetchedOverrides);
};

const isComponentRoot = (node: InstanceNode): boolean => {
  if (node.id.startsWith('I')) {
    return false;
  }

  let parent = node.parent;

  while (parent !== null) {
    if (parent.type === 'COMPONENT') {
      return false;
    }

    parent = parent.parent;
  }

  return true;
};
