import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformSceneNode
} from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';

export const transformGroupNode = async (
  node: GroupNode,
  baseX: number,
  baseY: number
): Promise<GroupShape> => {
  return {
    ...transformFigmaIds(node),
    ...transformGroupNodeLike(node, baseX, baseY),
    ...transformEffects(node),
    ...transformBlend(node),
    ...(await transformChildren(node, baseX, baseY))
  };
};

export const transformGroupNodeLike = (
  node: BaseNodeMixin & DimensionAndPositionMixin & SceneNodeMixin,
  baseX: number,
  baseY: number
): GroupShape => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node)
  };
};
