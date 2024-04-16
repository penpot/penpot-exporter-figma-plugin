import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';

import { PathShape } from '@ui/lib/types/path/pathShape';

export const transformVectorNode = (node: VectorNode, baseX: number, baseY: number): PathShape => {
  return {
    type: 'path',
    name: node.name,
    fills: translateFills(node.fills, node.width, node.height),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
