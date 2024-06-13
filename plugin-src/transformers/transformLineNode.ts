import {
  transformBlend,
  transformConstraints,
  transformEffects,
  transformFigmaIds,
  transformPosition,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { translateLineNode } from '@plugin/translators/vectors';

import { PathShape } from '@ui/lib/types/shapes/pathShape';

export const transformLineNode = (node: LineNode, baseX: number, baseY: number): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translateLineNode(node, baseX, baseY),
    ...transformFigmaIds(node),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformConstraints(node)
  };
};
