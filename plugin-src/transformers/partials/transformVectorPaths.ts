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

import { PathAttributes, PathShape } from '@ui/lib/types/shapes/pathShape';

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

export const transformVectorPaths = (
  node: VectorNode,
  baseX: number,
  baseY: number
): PathShape[] => {
  const pathShapes = node.vectorPaths
    .filter((vectorPath, index) => {
      return (
        nodeHasFills(node, vectorPath, (node.vectorNetwork.regions ?? [])[index]) ||
        node.strokes.length > 0
      );
    })
    .map((vectorPath, index) =>
      transformVectorPath(node, vectorPath, (node.vectorNetwork.regions ?? [])[index], baseX, baseY)
    );

  const geometryShapes = node.fillGeometry
    .filter(
      geometry =>
        !node.vectorPaths.find(
          vectorPath => normalizePath(vectorPath.data) === normalizePath(geometry.data)
        )
    )
    .map(geometry => transformVectorPath(node, geometry, undefined, baseX, baseY));

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

const nodeHasFills = (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined
): boolean => {
  return !!(vectorPath.windingRule !== 'NONE' && (vectorRegion?.fills || node.fills));
};

const transformVectorPath = (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined,
  baseX: number,
  baseY: number
): PathShape => {
  const normalizedPaths = parseSVG(vectorPath.data);

  return {
    type: 'path',
    name: 'svg-path',
    content: translateCommandsToSegments(normalizedPaths, baseX + node.x, baseY + node.y),
    fills:
      vectorPath.windingRule === 'NONE' ? [] : translateFills(vectorRegion?.fills ?? node.fills),
    svgAttrs: {
      fillRule: translateWindingRule(vectorPath.windingRule)
    },
    constraintsH: 'scale',
    constraintsV: 'scale',
    ...transformStrokesFromVector(node, normalizedPaths, vectorRegion),
    ...transformEffects(node),
    ...transformDimensionAndPositionFromVectorPath(vectorPath, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
