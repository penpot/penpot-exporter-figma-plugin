import {
  transformBlend,
  transformChildren,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { translateBoolType } from '@plugin/translators';

import { BoolShape } from '@ui/lib/types/shapes/boolShape';

export const transformBooleanNode = async (
  node: BooleanOperationNode,
  baseX: number,
  baseY: number,
  remote: boolean = false
): Promise<BoolShape> => {
  return {
    type: 'bool',
    name: node.name,
    boolType: translateBoolType(node.booleanOperation),
    ...transformFigmaIds(node),
    ...(await transformChildren(node, baseX, baseY, remote)),
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
