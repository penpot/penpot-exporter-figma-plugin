import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills, translateVectorPaths } from '@plugin/translators';

import { PathShape } from '@ui/lib/types/path/pathShape';

export const transformPolygonNode = (
  node: PolygonNode,
  baseX: number,
  baseY: number
): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translateVectorPaths(node.fillGeometry, baseX + node.x, baseY + node.y),
    fills: translateFills(node.fills, node.width, node.height),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
