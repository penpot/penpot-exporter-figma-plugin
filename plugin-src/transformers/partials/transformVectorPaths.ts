import { parseSVG } from 'svg-path-parser';

import {
  // transformStrokesFromVectorNetwork,
  transformBlend,
  transformDimensionAndPositionFromVectorPath,
  transformEffects,
  transformProportion,
  transformSceneNode,
  transformStrokesFromVector
} from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators/fills';
import {
  // PartialVectorNetwork,
  // splitVectorNetwork,
  // translatePartialVectorNetwork,
  translateLineNode,
  translateVectorPath,
  translateVectorPaths,
  translateWindingRule
} from '@plugin/translators/vectors';

import { PathAttributes } from '@ui/lib/types/shapes/pathShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';

// import { Children } from '@ui/lib/types/utils/children';

const getVectorPaths = (node: VectorNode | StarNode | LineNode | PolygonNode): VectorPaths => {
  switch (node.type) {
    case 'STAR':
    case 'POLYGON':
      return node.fillGeometry;
    case 'VECTOR':
      return node.vectorPaths;
    case 'LINE':
      return translateLineNode(node);
  }
};

export const transformVectorPathsAsContent = (
  node: VectorNode | StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): PathAttributes => {
  const vectorPaths = getVectorPaths(node);

  return {
    content: translateVectorPaths(vectorPaths, baseX + node.x, baseY + node.y)
  };
};

// export const transformVectorPathsAsChildren = async (
//   node: VectorNode,
//   baseX: number,
//   baseY: number
// ): Promise<Children> => {
//   return {
//     children: await Promise.all(
//       node.vectorPaths.map((vectorPath, index) =>
//         transformVectorPath(
//           node,
//           vectorPath,
//           (node.vectorNetwork.regions ?? [])[index],
//           baseX,
//           baseY
//         )
//       )
//     )
//   };

//   const partialVectorNetworks = splitVectorNetwork(node);
//   return {
//     children: await Promise.all(
//       partialVectorNetworks.map(partialVectorNetwork =>
//         transformPartialVectorNetwork(node, partialVectorNetwork, baseX, baseY)
//       )
//     )
//   };
// };

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
          !node.vectorPaths.find(vectorPath => vectorPath.data === addSpaces(geometry.data))
      )
      .map(geometry => transformVectorPath(node, geometry, undefined, baseX, baseY, true))
  );

  return [...geometryShapes, ...pathShapes];
};

const addSpaces = (string: string): string => {
  return string.replace(/([A-Za-z])([0-9])/g, '$1 $2');
};

const transformVectorPath = async (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined,
  baseX: number,
  baseY: number,
  isGeometry = false
): Promise<PathShape> => {
  const normalizedPaths = parseSVG(vectorPath.data);

  return {
    type: 'path',
    name: 'svg-path',
    content: translateVectorPath(normalizedPaths, baseX + node.x, baseY + node.y),
    fills:
      vectorPath.windingRule === 'NONE'
        ? []
        : await translateFills(vectorRegion?.fills ?? node.fills),
    svgAttrs: {
      fillRule: translateWindingRule(vectorPath.windingRule)
    },
    ...(isGeometry
      ? { strokes: [] }
      : await transformStrokesFromVector(node, normalizedPaths, vectorRegion)),
    ...transformEffects(node),
    ...transformDimensionAndPositionFromVectorPath(vectorPath, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};

// const transformPartialVectorNetwork = async (
//   node: VectorNode,
//   partialVectorNetwork: PartialVectorNetwork,
//   baseX: number,
//   baseY: number
// ): Promise<PathShape> => {
//   const vectorPath =
//     partialVectorNetwork.vectorPath ??
//     translatePartialVectorNetwork(node.vectorNetwork, partialVectorNetwork);
//   console.log(vectorPath);

//   return {
//     type: 'path',
//     name: 'svg-path',
//     content: translateVectorPath(vectorPath, baseX + node.x, baseY + node.y),
//     fills:
//       vectorPath.windingRule === 'NONE'
//         ? []
//         : await translateFills(partialVectorNetwork.region?.fills ?? node.fills),
//     svgAttrs: {
//       fillRule: translateWindingRule(vectorPath.windingRule)
//     },
//     ...(await transformStrokesFromVectorNetwork(node, partialVectorNetwork)),
//     ...transformEffects(node),
//     ...transformDimensionAndPositionFromVectorPath(vectorPath, baseX, baseY),
//     ...transformSceneNode(node),
//     ...transformBlend(node),
//     ...transformProportion(node)
//   };
// };
