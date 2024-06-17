import {
  transformBlend,
  transformConstraints,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { translatePathNode } from '@plugin/translators/vectors';

import { PathShape } from '@ui/lib/types/shapes/pathShape';

export const transformPathNode = (
  node: StarNode | PolygonNode,
  baseRotation: number
): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translatePathNode(node, baseRotation),
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformConstraints(node),
    ...transformOverrides(node)
  };
};
