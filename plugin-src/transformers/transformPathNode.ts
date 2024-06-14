import {
  transformBlend,
  transformConstraints,
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

export const transformPathNode = (node: StarNode | PolygonNode): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translateVectorPaths(
      node.fillGeometry,
      node.absoluteTransform[0][2],
      node.absoluteTransform[1][2]
    ),
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node),
    ...transformConstraints(node)
  };
};
