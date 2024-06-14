import {
  transformBlend,
  transformChildren,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformLayoutItemZIndex,
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
  zIndex: number
): Promise<BoolShape> => {
  return {
    type: 'bool',
    name: node.name,
    boolType: translateBoolType(node.booleanOperation),
    ...transformLayoutItemZIndex(zIndex),
    ...transformFigmaIds(node),
    ...(await transformChildren(node, baseX, baseY)),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node)
  };
};
