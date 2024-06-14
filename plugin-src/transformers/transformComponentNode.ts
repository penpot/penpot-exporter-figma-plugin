import { componentsLibrary } from '@plugin/ComponentLibrary';
import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformLayoutItemZIndex,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { ComponentRoot } from '@ui/types';

export const transformComponentNode = async (
  node: ComponentNode,
  baseX: number,
  baseY: number,
  zIndex: number
): Promise<ComponentRoot> => {
  componentsLibrary.register(node.id, {
    type: 'component',
    name: node.name,
    path: node.parent?.type === 'COMPONENT_SET' ? node.parent.name : '',
    showContent: !node.clipsContent,
    ...transformLayoutItemZIndex(zIndex),
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformCornerRadius(node),
    ...(await transformChildren(node, baseX + node.x, baseY + node.y, zIndex)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformConstraints(node),
    ...transformAutoLayout(node)
  });

  return {
    figmaId: node.id,
    type: 'component'
  };
};
