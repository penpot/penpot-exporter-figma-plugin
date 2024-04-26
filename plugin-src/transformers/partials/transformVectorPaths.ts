import { translateVectorPaths } from '@plugin/translators';

import { PathAttributes } from '@ui/lib/types/path/pathAttributes';

const hasFillGeometry = (node: VectorNode | StarNode | LineNode | PolygonNode): boolean => {
  return 'fillGeometry' in node && node.fillGeometry.length > 0;
};

const hasStrokeGeometry = (node: VectorNode | StarNode | LineNode | PolygonNode): boolean => {
  return 'strokeGeometry' in node && node.strokeGeometry.length > 0;
};

const hasStrokeCaps = (node: GeometryMixin & VectorLikeMixin): boolean => {
  if (node.strokeCap !== figma.mixed) {
    return node.strokeCap !== 'NONE';
  }

  if (node.vectorNetwork && node.vectorNetwork.vertices.length > 0) {
    // check all vertices to see if they have stroke caps
    return node.vectorNetwork.vertices.some(
      vertex => vertex.strokeCap && vertex.strokeCap !== 'NONE'
    );
  }

  return false;
};

const getVectorPaths = (node: VectorNode | StarNode | LineNode | PolygonNode): VectorPaths => {
  console.log(node);
  switch (node.type) {
    case 'STAR':
    case 'POLYGON':
      return node.fillGeometry;
    case 'VECTOR':
      // mixed vector & simple open figures
      if (hasStrokeGeometry(node) && !hasStrokeCaps(node) && node.strokeGeometry.length > 0) {
        return node.strokeGeometry;
      }

      // simple closed figures
      if (hasFillGeometry(node)) {
        return node.fillGeometry;
      }

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
