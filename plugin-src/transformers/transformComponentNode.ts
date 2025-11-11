import { components } from '@plugin/libraries';
import { registerComponentProperties } from '@plugin/registerComponentProperties';
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
  transformId,
  transformIds,
  transformLayoutAttributes,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariantNameAndProperties
} from '@plugin/transformers/partials';

import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import type { ComponentRoot } from '@ui/types';

export const transformComponentNode = async (node: ComponentNode): Promise<ComponentRoot> => {
  const isVariant = node.parent?.type === 'COMPONENT_SET';

  const component: ComponentShape = {
    type: 'component',
    showContent: !node.clipsContent,
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
    ...(await transformChildren(node)),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformConstraints(node),
    ...transformAutoLayout(node),
    ...(isVariant ? transformVariantNameAndProperties(node) : {})
  };

  components.set(component.id, component);

  if (!isVariant) {
    registerComponentProperties(node);
  }

  return {
    type: 'component',
    name: node.name,
    id: component.id,
    variantId: isVariant ? transformId(node.parent) : undefined
  };
};
