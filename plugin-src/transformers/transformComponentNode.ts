import { componentsLibrary } from '@plugin/ComponentLibrary';
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
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { ComponentRoot } from '@ui/types';

export const transformComponentNode = async (
  node: ComponentNode,
  baseRotation: number
): Promise<ComponentRoot> => {
  componentsLibrary.register(node.id, {
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
    ...(await transformChildren(node, node.rotation + baseRotation)),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseRotation),
    ...transformConstraints(node),
    ...transformAutoLayout(node)
  });

  return {
    figmaId: node.id,
    type: 'component',
    name: node.name
  };
};
