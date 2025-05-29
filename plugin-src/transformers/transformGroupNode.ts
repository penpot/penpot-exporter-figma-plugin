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

export const transformGroupNode = async (node: GroupNode): Promise<GroupShape> => {
  return {
    ...transformFigmaIds(node),
    ...transformGroupNodeLike(node),
    ...transformEffects(node),
    ...transformBlend(node),
    ...(await transformChildren(node)),
    ...transformOverrides(node)
  };
};

export const transformGroupNodeLike = (node: SceneNode): GroupShape => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node)
  };
};
