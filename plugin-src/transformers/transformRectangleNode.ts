import {
  transformBlend,
  transformDimensionAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateFills, translateStrokes } from '@plugin/translators';
import { matrixInvert } from '@plugin/utils/matrixInvert';

import { RectShape } from '@ui/lib/types/rect/rectShape';

// import { Point } from '@ui/lib/types/utils/point';

export const transformRectangleNode = (
  node: RectangleNode,
  baseX: number,
  baseY: number
): RectShape => {
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
    fills: translateFills(node.fills, node.width, node.height),
    strokes: translateStrokes(node),
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
