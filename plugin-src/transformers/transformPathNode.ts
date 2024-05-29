import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes,
  transformVectorPathsAsContent
} from '@plugin/transformers/partials';

import { PathShape } from '@ui/lib/types/shapes/pathShape';

const hasFillGeometry = (node: StarNode | LineNode | PolygonNode): boolean => {
  return 'fillGeometry' in node && node.fillGeometry.length > 0;
};

export const transformPathNode = async (
  node: StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): Promise<PathShape> => {
  return {
    type: 'path',
    figmaId: node.id,
    name: node.name,
    ...(hasFillGeometry(node) ? await transformFills(node) : []),
    ...(await transformStrokes(node)),
    ...transformEffects(node),
    ...transformVectorPathsAsContent(node, baseX, baseY),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
