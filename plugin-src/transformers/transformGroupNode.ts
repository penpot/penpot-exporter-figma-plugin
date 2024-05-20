import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
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
    ...(await transformChildren(node, baseX, baseY))
  };
};

export const transformGroupNodeLike = (
  node: BaseNodeMixin & DimensionAndPositionMixin & BlendMixin & SceneNodeMixin & MinimalBlendMixin,
  baseX: number,
  baseY: number,
  isVectorGroup: boolean = false
): GroupShape => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...(isVectorGroup ? {} : transformEffects(node)),
    ...(isVectorGroup ? {} : transformBlend(node))
  };
};
