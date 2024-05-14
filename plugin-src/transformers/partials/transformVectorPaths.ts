import {
  transformBlend,
  transformDimensionAndPositionFromVectorPath,
  transformEffects,
  transformProportion,
  transformSceneNode,
  transformStrokesFromVectorNetwork
} from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators/fills';
import {
  PartialVectorNetwork,
  splitVectorNetwork,
  translateLineNode,
  translatePartialVectorNetwork,
  translateVectorPath,
  translateVectorPaths
} from '@plugin/translators/vectors';

import { PathAttributes } from '@ui/lib/types/shapes/pathShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { Children } from '@ui/lib/types/utils/children';

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

export const transformVectorPathsAsChildren = async (
  node: VectorNode,
  baseX: number,
  baseY: number
): Promise<Children> => {
  const partialVectorNetworks = splitVectorNetwork(node.vectorNetwork);

  return {
    children: await Promise.all(
      partialVectorNetworks.map(partialVectorNetwork =>
        transformVectorPath(node, partialVectorNetwork, baseX, baseY)
      )
    )
  };
};

const transformVectorPath = async (
  node: VectorNode,
  partialVectorNetwork: PartialVectorNetwork,
  baseX: number,
  baseY: number
): Promise<PathShape> => {
  const vectorPath = translatePartialVectorNetwork(node.vectorNetwork, partialVectorNetwork);

  return {
    type: 'path',
    name: 'svg-path',
    content: translateVectorPath(vectorPath, baseX + node.x, baseY + node.y),
    fills: await translateFills(partialVectorNetwork.region?.fills ?? node.fills),
    ...(await transformStrokesFromVectorNetwork(node, partialVectorNetwork)),
    ...transformEffects(node),
    ...transformDimensionAndPositionFromVectorPath(vectorPath, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
