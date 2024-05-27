import SVGPathCommander from 'svg-path-commander';
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
import { Point } from '@ui/lib/types/utils/point';

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
  console.log(node);
  const pathShapes = await Promise.all(
    node.vectorPaths
      .filter((vectorPath, index) => {
        return (
          nodeHasFills(node, vectorPath, (node.vectorNetwork.regions ?? [])[index]) ||
          node.strokes.length > 0
        );
      })
      .map((vectorPath, index) =>
        transformVectorPath(
          node,
          vectorPath,
          (node.vectorNetwork.regions ?? [])[index],
          baseX,
          baseY
        )
      )
  );

  const geometryShapes = await Promise.all(
    node.fillGeometry
      .filter(geometry => !filterMatchingGeometry(node.vectorPaths, geometry))
      .map(geometry => transformVectorPath(node, geometry, undefined, baseX, baseY))
  );

  return [...geometryShapes, ...pathShapes];
};

const filterMatchingGeometry = (vectorPaths: VectorPaths, fillGeometry: VectorPath): boolean => {
  if (
    !vectorPaths.find(
      vectorPath => normalizePath(vectorPath.data) === normalizePath(fillGeometry.data)
    )
  ) {
    return true;
  }

  const geometryLength = SVGPathCommander.getTotalLength(fillGeometry.data);
  const geometryVertices = getVerticesFromPath(fillGeometry.data);

  return !vectorPaths.some(vectorPath => {
    const vectorLength = SVGPathCommander.getTotalLength(vectorPath.data);
    return (
      Math.abs(geometryLength - vectorLength) <= 0.01 &&
      compareVertices(getVerticesFromPath(vectorPath.data), geometryVertices)
    );
  });
};

const getVerticesFromPath = (path: string): Point[] => {
  const commands = parseSVG(path);
  const points: Point[] = [];

  commands.forEach(command => {
    switch (command.command) {
      case 'moveto':
      case 'lineto':
      case 'curveto':
        points.push({ x: command.x, y: command.y });
        break;
      case 'closepath':
        break;
    }
  });

  return points;
};

const compareVertices = (vertices1: Point[], vertices2: Point[]): boolean => {
  if (vertices1.length !== vertices2.length) {
    return false;
  }

  const set1 = new Set(vertices1.map(v => `${v.x},${v.y}`));
  const set2 = new Set(vertices2.map(v => `${v.x},${v.y}`));

  if (set1.size !== set2.size) {
    return false;
  }

  for (const vertex of set1) {
    if (!set2.has(vertex)) {
      return false;
    }
  }

  return true;
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
