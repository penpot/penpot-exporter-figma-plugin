import {
  transformBlend,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformOverrides,
  transformRotationAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';

export const transformGroupNode = async (
  node: GroupNode,
  baseRotation: number
): Promise<GroupShape> => {
  return {
    ...transformFigmaIds(node),
    ...transformGroupNodeLike(node, baseRotation),
    ...transformEffects(node),
    ...transformBlend(node),
    ...(await transformChildren(node, baseRotation)),
    ...transformOverrides(node)
  };
};

export const transformGroupNodeLike = (
  node: BaseNodeMixin & LayoutMixin & SceneNodeMixin,
  baseRotation: number
): GroupShape => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseRotation),
    ...transformSceneNode(node)
  };
};
