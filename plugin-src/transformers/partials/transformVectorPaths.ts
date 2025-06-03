import { parseSVG } from 'svg-path-parser';

import {
  transformBlend,
  transformEffects,
  transformLayoutAttributes,
  transformProportion,
  transformSceneNode,
  transformStrokesFromVector,
  transformVectorFills
} from '@plugin/transformers/partials';
import { translateCommands, translateWindingRule } from '@plugin/translators/vectors';

import { PathShape } from '@ui/lib/types/shapes/pathShape';

export const transformVectorPaths = (node: VectorNode): PathShape[] => {
  let regions: readonly VectorRegion[] = [];

  try {
    regions = node.vectorNetwork?.regions ?? [];
  } catch (error) {
    console.warn('Could not access the vector network', node, error);
  }

  const strokeLength = node.strokes.length;

  const pathShapes = node.vectorPaths
    .filter((vectorPath, index) => {
      return strokeLength > 0 || nodeHasFills(node, vectorPath, regions[index]);
    })
    .map((vectorPath, index) => transformVectorPath(node, vectorPath, regions[index]));

  if (regions.length > 0) {
    return pathShapes;
  }

  const normalizedVectorPaths = node.vectorPaths.map(vectorPath => normalizePath(vectorPath.data));

  const geometryShapes = node.fillGeometry
    .filter(geometry => {
      const normalizedGeometry = normalizePath(geometry.data);

      return !normalizedVectorPaths.find(
        normalizedVectorPath => normalizedVectorPath === normalizedGeometry
      );
    })
    .map(geometry => transformVectorPath(node, geometry, undefined));

  return [...geometryShapes, ...pathShapes];
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
  vectorRegion: VectorRegion | undefined
): PathShape => {
  const normalizedPaths = parseSVG(vectorPath.data);

  return {
    type: 'path',
    name: 'svg-path',
    content: translateCommands(node, normalizedPaths),
    svgAttrs: {
      fillRule: translateWindingRule(vectorPath.windingRule)
    },
    constraintsH: 'scale',
    constraintsV: 'scale',
    ...transformVectorFills(node, vectorPath, vectorRegion),
    ...transformStrokesFromVector(node, normalizedPaths, vectorRegion),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node)
  };
};
