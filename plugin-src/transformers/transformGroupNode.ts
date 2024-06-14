import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformLayoutItemZIndex,
  transformSceneNode
} from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';

export const transformGroupNode = async (
  node: GroupNode,
  baseX: number,
  baseY: number,
  zIndex: number
): Promise<GroupShape> => {
  return {
    ...transformFigmaIds(node),
    ...transformGroupNodeLike(node, baseX, baseY, zIndex),
    ...transformEffects(node),
    ...transformBlend(node),
    ...(await transformChildren(node, baseX, baseY))
  };
};

export const transformGroupNodeLike = (
  node: BaseNodeMixin & DimensionAndPositionMixin & SceneNodeMixin,
  baseX: number,
  baseY: number,
  zIndex: number
): GroupShape => {
  return {
    type: 'group',
    name: node.name,
    ...transformLayoutItemZIndex(zIndex),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node)
  };
};
