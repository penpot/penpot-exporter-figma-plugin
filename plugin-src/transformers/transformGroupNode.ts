import {
  transformBlend,
  transformDimension,
  transformEffects,
  transformIds,
  transformOverrides,
  transformRotationAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';

export const transformGroupNode = async (node: GroupNode): Promise<GroupShape> => {
  return {
    ...transformIds(node),
    ...transformGroupNodeLike(node),
    ...transformEffects(node),
    ...transformBlend(node),
    ...(await transformChildren(node)),
    ...transformOverrides(node)
  };
};

export const transformGroupNodeLike = (node: SceneNode): Omit<GroupShape, 'id' | 'shapeRef'> => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node)
  };
};
