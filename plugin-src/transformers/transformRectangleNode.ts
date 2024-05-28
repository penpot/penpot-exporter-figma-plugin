import {
  transformBlend,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { matrixInvert } from '@plugin/utils';

import { RectShape } from '@ui/lib/types/shapes/rectShape';

export const transformRectangleNode = async (
  node: RectangleNode,
  baseX: number,
  baseY: number
): Promise<RectShape> => {
  const transform2d = [
    node.absoluteTransform[0].slice(0, 2),
    node.absoluteTransform[1].slice(0, 2)
  ];
  const inverseTransform = matrixInvert(transform2d);
  return {
    type: 'rect',
    name: node.name,
    rotation: -node.rotation < 0 ? -node.rotation + 360 : -node.rotation,
    transform: {
      a: transform2d[0][0],
      b: transform2d[1][0],
      c: transform2d[0][1],
      d: transform2d[1][1],
      e: 0,
      f: 0
    },
    transformInverse: inverseTransform
      ? {
          a: inverseTransform[0][0],
          b: inverseTransform[1][0],
          c: inverseTransform[0][1],
          d: inverseTransform[1][1],
          e: -0,
          f: 0
        }
      : undefined,
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node)
  };
};
