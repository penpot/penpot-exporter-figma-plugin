import { translateStrokes } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

const isVectorLike = (node: MinimalStrokesMixin | VectorLikeMixin): node is VectorLikeMixin => {
  return 'vectorNetwork' in node;
};

const hasGeometry = (
  node: MinimalStrokesMixin | GeometryMixin | (MinimalStrokesMixin & VectorLikeMixin)
): boolean => {
  return 'fillGeometry' in node && node.fillGeometry.length > 0;
};

export const transformStrokes = (
  node: MinimalStrokesMixin | GeometryMixin | (MinimalStrokesMixin & VectorLikeMixin)
): Partial<ShapeAttributes> => {
  return {
    strokes: translateStrokes(
      node.strokes,
      node.strokeWeight,
      hasGeometry(node),
      isVectorLike(node) ? node.vectorNetwork : undefined
    )
  };
};
