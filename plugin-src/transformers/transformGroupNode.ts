import {
  transformBlend,
  transformDimension,
  transformEffects,
  transformRotationAndPosition,
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
    ...transformGroupNodeLike(node, baseX, baseY),
    ...transformEffects(node),
    ...transformBlend(node),
    ...(await transformChildren(node, baseX, baseY)),
    ...transformRotationAndPosition(node, baseX, baseY)
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
    x: node.x + baseX,
    y: node.y + baseY,
    ...transformDimension(node),
    ...transformSceneNode(node)
  };
};
