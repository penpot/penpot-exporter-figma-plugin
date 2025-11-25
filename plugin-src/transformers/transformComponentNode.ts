import { components } from '@plugin/libraries';
import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformComponentNameAndPath,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformGrids,
  transformId,
  transformIds,
  transformLayoutAttributes,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap,
  transformVariantNameAndProperties
} from '@plugin/transformers/partials';
import { registerComponentProperties } from '@plugin/translators/components';
import { generateUuid } from '@plugin/utils';

import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';

export const transformComponentNode = async (node: ComponentNode): Promise<ComponentShape> => {
  const isVariant = node.parent?.type === 'COMPONENT_SET';
  const variantId = isVariant ? transformId(node.parent) : undefined;

  const component: ComponentShape = {
    type: 'component',
    showContent: !node.clipsContent,
    componentId: generateUuid(),
    componentRoot: true,
    mainInstance: true,
    variantId,
    ...transformComponentNameAndPath(node),
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
    ...(isVariant ? transformVariantNameAndProperties(node, variantId!) : {})
  };

  const nameSplit = component.name.split(' / ');

  components.set(component.id, {
    name: nameSplit[nameSplit.length - 1],
    componentId: component.componentId!,
    frameId: component.id,
    variantId
  });

  if (!isVariant) {
    registerComponentProperties(node);
  }

  return component;
};
