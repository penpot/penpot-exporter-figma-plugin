import { translateStrokes } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

const isVectorLike = (node: GeometryMixin | VectorLikeMixin): node is VectorLikeMixin => {
  return 'vectorNetwork' in node;
};

const hasFillGeometry = (node: GeometryMixin | (GeometryMixin & VectorLikeMixin)): boolean => {
  return node.fillGeometry.length > 0;
};

export const transformStrokes = (
  node: GeometryMixin | (GeometryMixin & VectorLikeMixin)
): Partial<ShapeAttributes> => {
  return {
    strokes: translateStrokes(
      node.strokes,
      node.strokeWeight,
      hasFillGeometry(node),
      isVectorLike(node) ? node.vectorNetwork : undefined
    )
  };
};
