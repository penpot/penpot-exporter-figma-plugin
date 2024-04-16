import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills, translateStrokes, translateVectorPaths } from '@plugin/translators';

import { PathShape } from '@ui/lib/types/path/pathShape';

export const transformPolygonNode = (
  node: PolygonNode,
  baseX: number,
  baseY: number
): PathShape => {
  console.log(node);
  return {
    type: 'path',
    name: node.name,
    content: translateVectorPaths(node.fillGeometry, baseX + node.x, baseY + node.y),
    strokes: translateStrokes(node),
    fills: translateFills(node.fills, node.width, node.height),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
