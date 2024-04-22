import {
  transformBlend,
  transformDimensionAndPosition,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes,
  transformVectorPaths
} from '@plugin/transformers/partials';

import { PathShape } from '@ui/lib/types/path/pathShape';

const hasFillGeometry = (node: VectorNode | StarNode | LineNode | PolygonNode): boolean => {
  return 'fillGeometry' in node && node.fillGeometry.length > 0;
};

export const transformPathNode = (
  node: VectorNode | StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): PathShape => {
  console.log(node.name, node);
  return {
    name: node.name,
    ...(hasFillGeometry(node) ? transformFills(node) : []),
    ...transformStrokes(node),
    ...transformVectorPaths(node, baseX, baseY),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
