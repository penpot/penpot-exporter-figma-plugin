import { translateVectorPaths } from '@plugin/translators';

import { PathAttributes } from '@ui/lib/types/path/pathAttributes';

const getVectorPaths = (node: VectorNode | StarNode | LineNode | PolygonNode): VectorPaths => {
  switch (node.type) {
    case 'STAR':
    case 'POLYGON':
      return node.fillGeometry;
    case 'VECTOR':
      return node.vectorPaths;
    case 'LINE':
      return node.strokeGeometry;
  }
};

export const transformVectorPaths = (
  node: VectorNode | StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): PathAttributes => {
  const vectorPaths = getVectorPaths(node);

  return {
    type: 'path',
    content: translateVectorPaths(vectorPaths, baseX + node.x, baseY + node.y)
  };
};
