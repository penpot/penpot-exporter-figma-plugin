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
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariantNameAndProperties
} from '@plugin/transformers/partials';

import type { ComponentRoot } from '@ui/types';

export const transformComponentNode = async (node: ComponentNode): Promise<ComponentRoot> => {
  const isVariant = node.parent?.type === 'COMPONENT_SET';

  components.set(node.id, {
    type: 'component',
    showContent: !node.clipsContent,
    ...transformComponentNameAndPath(node),
    ...transformFigmaIds(node),
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
  });

  if (!isVariant) {
    registerComponentProperties(node);
  }

  return {
    type: 'component',
    name: node.name,
    figmaId: node.id,
    figmaVariantId: isVariant ? node.parent.id : undefined
  };
};
