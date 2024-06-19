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

export const transformGroupNode = (node: GroupNode): GroupShape => {
  return {
    ...transformFigmaIds(node),
    ...transformGroupNodeLike(node),
    ...transformEffects(node),
    ...transformBlend(node),
    ...transformChildren(node),
    ...transformOverrides(node)
  };
};

export const transformGroupNodeLike = (
  node: BaseNodeMixin & LayoutMixin & SceneNodeMixin
): Omit<GroupShape, 'children'> => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node)
  };
};
