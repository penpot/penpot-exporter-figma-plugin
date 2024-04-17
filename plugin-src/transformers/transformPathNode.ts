import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVectorPaths
} from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';

import { PathShape } from '@ui/lib/types/path/pathShape';

export const transformPathNode = (
  node: VectorNode | StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): PathShape => {
  return {
    name: node.name,
    fills: node.fillGeometry.length ? translateFills(node.fills, node.width, node.height) : [],
    ...transformStrokes(node),
    ...transformVectorPaths(node, baseX, baseY),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
