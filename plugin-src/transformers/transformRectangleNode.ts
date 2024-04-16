import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';
import { matrixInvert } from '@plugin/utils/matrixInvert';

import { RectShape } from '@ui/lib/types/rect/rectShape';

export const transformRectangleNode = (
  node: RectangleNode,
  baseX: number,
  baseY: number
): RectShape => {
  const absoluteTransformInverse = matrixInvert([
    [node.absoluteTransform[0][0], node.absoluteTransform[0][1]],
    [node.absoluteTransform[1][0], node.absoluteTransform[1][1]]
  ]);

  console.log(node.absoluteTransform, absoluteTransformInverse);

  return {
    type: 'rect',
    name: node.name,
    fills: translateFills(node.fills, node.width, node.height),
    transform: {
      a: node.absoluteTransform[0][0],
      b: node.absoluteTransform[1][0],
      c: node.absoluteTransform[0][1],
      d: node.absoluteTransform[1][1],
      e: 0,
      f: 0
    },
    transformInverse: absoluteTransformInverse
      ? {
          a: absoluteTransformInverse[0][0],
          b: absoluteTransformInverse[1][0],
          c: absoluteTransformInverse[0][1],
          d: absoluteTransformInverse[1][1],
          e: 0,
          f: 0
        }
      : undefined,
    rotation: -node.rotation < 0 ? -node.rotation + 360 : -node.rotation,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node)
  };
};
