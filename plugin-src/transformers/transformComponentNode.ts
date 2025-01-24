import { components } from '@plugin/libraries';
import { registerComponentProperties } from '@plugin/registerComponentProperties';
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
  transformLayoutGrids,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { ComponentRoot } from '@ui/types';

const isNonVariantComponentNode = (node: ComponentNode): boolean => {
  return node.parent?.type !== 'COMPONENT_SET';
};

export const transformComponentNode = async (node: ComponentNode): Promise<ComponentRoot> => {
  components.set(node.id, {
    type: 'component',
    name: node.name,
    path: node.parent?.type === 'COMPONENT_SET' ? node.parent.name : '',
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
    ...(await transformChildren(node)),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformConstraints(node),
    ...transformAutoLayout(node),
    ...transformLayoutGrids(node)
  });

  if (isNonVariantComponentNode(node)) {
    registerComponentProperties(node);
  }

  return {
    figmaId: node.id,
    type: 'component',
    name: node.name
  };
};
