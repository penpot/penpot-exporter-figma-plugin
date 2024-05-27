import SVGPathCommander from 'svg-path-commander';
import { parseSVG } from 'svg-path-parser';



import { transformBlend, transformDimensionAndPositionFromVectorPath, transformEffects, transformProportion, transformSceneNode, transformStrokesFromVector } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators/fills';
import { translateCommandsToSegments, translateLineNode, translateVectorPaths, translateWindingRule } from '@plugin/translators/vectors';



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
      .filter(
        geometry =>
          !node.vectorPaths.find(vectorPath => {
            // console.log(vectorPath.data, geometry.data);
            console.log(
              SVGPathCommander.optimizePath(SVGPathCommander.normalizePath(vectorPath.data), 2),
              SVGPathCommander.optimizePath(SVGPathCommander.normalizePath(geometry.data), 2),
              new SVGPathCommander(vectorPath.data, { round: 'auto' }).optimize().toString() ===
                new SVGPathCommander(geometry.data, { round: 'auto' }).optimize().toString(),
              SVGPathCommander.normalizePath(vectorPath.data),
              SVGPathCommander.normalizePath(geometry.data),
              normalizePath(vectorPath.data) === normalizePath(geometry.data),
              Math.abs(
                SVGPathCommander.getTotalLength(vectorPath.data) -
                  SVGPathCommander.getTotalLength(geometry.data)
              ) <= 0.01
            );

            // compare vertexs of the path


            return normalizePath(vectorPath.data) === normalizePath(geometry.data);
          })
      )
      .map(geometry => transformVectorPath(node, geometry, undefined, baseX, baseY))
  );

  return [...geometryShapes, ...pathShapes];
};


const compareVertices = (vertices1: Vertex[], vertices2: Vertex[]): boolean => {
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
}

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
