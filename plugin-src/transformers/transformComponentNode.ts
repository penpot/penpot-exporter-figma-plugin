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
  transformVariantName,
  transformVariantProperties
} from '@plugin/transformers/partials';

import type { ComponentRoot } from '@ui/types';

const isNonVariantComponentNode = (node: ComponentNode): boolean => {
  return node.parent?.type !== 'COMPONENT_SET';
};

export const transformComponentNode = async (node: ComponentNode): Promise<ComponentRoot> => {
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
    ...transformVariantName(node),
    ...transformVariantProperties(node)
  });

  if (isNonVariantComponentNode(node)) {
    registerComponentProperties(node);
  }

  return {
    type: 'component',
    name: node.name,
    figmaId: node.id,
    figmaVariantId: node.parent?.type === 'COMPONENT_SET' ? node.parent.id : undefined
  };
};
