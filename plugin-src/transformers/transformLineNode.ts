import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills, translateStrokes, translateVectorPaths } from '@plugin/translators';

import { PathShape } from '@ui/lib/types/path/pathShape';

export const transformLineNode = (node: LineNode, baseX: number, baseY: number): PathShape => {
  return {
    type: 'path',
    name: node.name,
    fills: node.fillGeometry.length ? translateFills(node.fills, node.width, node.height) : [],
    content: translateVectorPaths(node.strokeGeometry, baseX + node.x, baseY + node.y),
    strokes: translateStrokes(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
