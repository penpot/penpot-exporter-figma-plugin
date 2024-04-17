import { translateStrokes } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

const isVectorLike = (node: MinimalStrokesMixin | VectorLikeMixin): node is VectorLikeMixin => {
  return 'vectorNetwork' in node;
};

export const transformStrokes = (
  node: MinimalStrokesMixin | (MinimalStrokesMixin & VectorLikeMixin)
): Partial<ShapeAttributes> => {
  return {
    strokes: translateStrokes(
      node.strokes,
      node.strokeWeight,
      isVectorLike(node) ? node.vectorNetwork : undefined
    )
  };
};
