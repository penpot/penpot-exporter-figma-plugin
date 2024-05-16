import { parseSVG } from 'svg-path-parser';

import {
  transformBlend,
  transformDimensionAndPositionFromVectorPath,
  transformEffects,
  transformProportion,
  transformSceneNode,
  transformStrokesFromVector
} from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators/fills';
import {
  translateCommandsToSegments,
  translateLineNode,
  translateVectorPaths,
  translateWindingRule
} from '@plugin/translators/vectors';

import { PathAttributes } from '@ui/lib/types/shapes/pathShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';

export const transformVectorPathsAsContent = (
  node: StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): PathAttributes => {
  const vectorPaths = getVectorPaths(node);

  return {
    content: translateVectorPaths(vectorPaths, baseX + node.x, baseY + node.y)
  };
};

export const transformVectorPaths = async (
  node: VectorNode,
  baseX: number,
  baseY: number
): Promise<PathShape[]> => {
  const pathShapes = await Promise.all(
    node.vectorPaths.map((vectorPath, index) =>
      transformVectorPath(node, vectorPath, (node.vectorNetwork.regions ?? [])[index], baseX, baseY)
    )
  );

  const geometryShapes = await Promise.all(
    node.fillGeometry
      .filter(
        geometry =>
          !node.vectorPaths.find(
            vectorPath => normalizePath(vectorPath.data) === normalizePath(geometry.data)
          )
      )
      .map(geometry => transformVectorPath(node, geometry, undefined, baseX, baseY))
  );

  return [...geometryShapes, ...pathShapes];
};

const getVectorPaths = (node: StarNode | LineNode | PolygonNode): VectorPaths => {
  switch (node.type) {
    case 'STAR':
    case 'POLYGON':
      return node.fillGeometry;
    case 'LINE':
      return translateLineNode(node);
  }
};

const normalizePath = (path: string): string => {
  // Round to 2 decimal places all numbers
  const str = path.replace(/(\d+\.\d+|\d+)/g, (match: string) => {
    return parseFloat(match).toFixed(2);
  });
  // remove spaces
  return str.replace(/\s/g, '');
};

const transformVectorPath = async (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined,
  baseX: number,
  baseY: number
): Promise<PathShape> => {
  const normalizedPaths = parseSVG(vectorPath.data);

  return {
    type: 'path',
    name: 'svg-path',
    content: translateCommandsToSegments(normalizedPaths, baseX + node.x, baseY + node.y),
    fills:
      vectorPath.windingRule === 'NONE'
        ? []
        : await translateFills(vectorRegion?.fills ?? node.fills),
    svgAttrs: {
      fillRule: translateWindingRule(vectorPath.windingRule)
    },
    ...(await transformStrokesFromVector(node, normalizedPaths, vectorRegion)),
    ...transformEffects(node),
    ...transformDimensionAndPositionFromVectorPath(vectorPath, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
