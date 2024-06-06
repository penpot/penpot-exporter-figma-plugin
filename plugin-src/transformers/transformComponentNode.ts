import { componentsLibrary } from '@plugin/ComponentLibrary';
import {
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { ComponentRoot } from '@ui/types';

export const transformComponentNode = async (
  node: ComponentNode,
  baseX: number,
  baseY: number
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
    ...transformCornerRadius(node),
    ...(await transformChildren(node, baseX + node.x, baseY + node.y)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformConstraints(node)
  });

  return {
    figmaId: node.id,
    type: 'component'
  };
};
