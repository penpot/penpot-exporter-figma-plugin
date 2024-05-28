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
import { matrixInvert } from '@plugin/utils/matrixInvert';

import { RectShape } from '@ui/lib/types/shapes/rectShape';

// import { Point } from '@ui/lib/types/utils/point';

export const transformRectangleNode = async (
  node: RectangleNode,
  baseX: number,
  baseY: number
): Promise<RectShape> => {
  const absoluteTransformInverse = matrixInvert([
    [node.absoluteTransform[0][0], node.absoluteTransform[0][1]],
    [node.absoluteTransform[1][0], node.absoluteTransform[1][1]]
  ]);

  // const transformedPoints = rectToPoints(node).map(point =>
  //   transform(point, node.absoluteTransform)
  // );

  return {
    type: 'rect',
    name: node.name,
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node),
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
    rotation: -node.rotation < 0 ? -node.rotation + 360 : -node.rotation
  };
};

// function rectToPoints(rect: RectangleNode): Point[] {
//   return [
//     { x: rect.x, y: rect.y },
//     { x: rect.x + rect.width, y: rect.y },
//     { x: rect.x + rect.width, y: rect.y + rect.height },
//     { x: rect.x, y: rect.y + rect.height }
//   ];
// }
//
// function transform(point: Point, matrix: number[][]): Point {
//   const x: number = point.x;
//   const y: number = point.y;
//
//   const newX: number = matrix.a * x + matrix.c * y + matrix.e;
//   const newY: number = matrix.b * x + matrix.d * y + matrix.f;
//
//   return { x: newX, y: newY };
// }
