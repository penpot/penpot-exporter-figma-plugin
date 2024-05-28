import {
  transformBlend,
  transformChildren,
  transformDimension,
  transformEffects,
  transformFills,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { translateBoolType } from '@plugin/translators';

import { BoolShape } from '@ui/lib/types/shapes/boolShape';

export const transformBooleanNode = async (
  node: BooleanOperationNode,
  baseX: number,
  baseY: number,
  baseRotation: number
): Promise<BoolShape> => {
  return {
    type: 'bool',
    name: node.name,
    boolType: translateBoolType(node.booleanOperation),
    ...(await transformChildren(node, baseX, baseY, baseRotation)),
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimension(node),
    ...transformRotationAndPosition(node, baseX, baseY, baseRotation),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
