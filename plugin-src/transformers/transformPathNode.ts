import {
  transformBlend,
  transformConstraints,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
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

export const transformPathNode = (
  node: StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): PathShape => {
  return {
    type: 'path',
    name: node.name,
    ...transformFigmaIds(node),
    ...(hasFillGeometry(node) ? transformFills(node) : []),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformVectorPathsAsContent(node, baseX, baseY),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformConstraints(node)
  };
};
