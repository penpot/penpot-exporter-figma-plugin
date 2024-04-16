import { transformDimensionAndPosition } from '@plugin/transformers/partials';

import { PathShape } from '@ui/lib/types/path/pathShape';

export const transformPolygonNode = (
  node: PolygonNode,
  baseX: number,
  baseY: number
): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: [],
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
