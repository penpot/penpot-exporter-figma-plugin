import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills, translateStrokes, translateVectorPaths } from '@plugin/translators';

import { PathShape } from '@ui/lib/types/path/pathShape';

export const transformPathNode = (
  node: DefaultShapeMixin,
  baseX: number,
  baseY: number,
  vectorPaths: readonly VectorPath[],
  vectorNetwork?: VectorNetwork
): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translateVectorPaths(vectorPaths, baseX + node.x, baseY + node.y),
    strokes: translateStrokes(node, vectorNetwork),
    fills: node.fillGeometry.length ? translateFills(node.fills, node.width, node.height) : [],
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
