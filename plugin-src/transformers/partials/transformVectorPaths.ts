import {
  transformBlend,
  transformDimensionAndPositionFromVectorPath,
  transformEffects,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { createLineGeometry, translateVectorPath, translateVectorPaths } from '@plugin/translators';
import { translateFills } from '@plugin/translators';

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
      return createLineGeometry(node);
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
  return {
    children: await Promise.all(
      node.vectorPaths.map((vectorPath, index) =>
        transformVectorPath(
          node,
          vectorPath,
          (node.vectorNetwork.regions ?? [])[index],
          baseX,
          baseY
        )
      )
    )
  };
};

const transformVectorPath = async (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined,
  baseX: number,
  baseY: number
): Promise<PathShape> => {
  const dimensionAndPosition = transformDimensionAndPositionFromVectorPath(
    vectorPath,
    baseX,
    baseY
  );

  return {
    type: 'path',
    name: 'svg-path',
    content: translateVectorPath(vectorPath, baseX + node.x, baseY + node.y),
    fills: await translateFills(
      vectorRegion?.fills ?? node.fills,
      dimensionAndPosition.width,
      dimensionAndPosition.height
    ),
    ...(await transformStrokes(node)),
    ...transformEffects(node),
    ...dimensionAndPosition,
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
