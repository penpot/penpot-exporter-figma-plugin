import {
  transformBlend,
  transformConstraints,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { translateVectorPaths } from '@plugin/translators/vectors';

import { PathShape } from '@ui/lib/types/shapes/pathShape';

export const transformPathNode = (
  node: StarNode | PolygonNode,
  baseX: number,
  baseY: number
): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translateVectorPaths(node.fillGeometry, baseX + node.x, baseY + node.y),
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformConstraints(node)
  };
};
