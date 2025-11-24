import {
  transformBlend,
  transformChildren,
  transformDimension,
  transformEffects,
  transformFills,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import { translateBoolType } from '@plugin/translators';

import type { BoolShape } from '@ui/lib/types/shapes/boolShape';

export const transformBooleanNode = async (
  node: BooleanOperationNode
): Promise<BoolShape | undefined> => {
  const children = await transformChildren(node);

  if (!children.children || children.children.length === 0) {
    // In Penpot, boolean groups without children are not supported.
    // In Figma, they are supported, but they do not make a lot of sense
    // so we just ignore them.
    return;
  }

  return {
    type: 'bool',
    name: node.name,
    boolType: translateBoolType(node.booleanOperation),
    ...transformIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformVariableConsumptionMap(node),
    ...children,
    ...transformOverrides(node)
  };
};
