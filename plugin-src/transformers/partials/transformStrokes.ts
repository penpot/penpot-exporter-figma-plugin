import { translateStrokes } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

const isVectorLike = (node: GeometryMixin | VectorLikeMixin): node is VectorLikeMixin => {
  return 'vectorNetwork' in node;
};

const isIndividualStrokes = (
  node: GeometryMixin | IndividualStrokesMixin
): node is IndividualStrokesMixin => {
  return 'strokeTopWeight' in node;
};

const hasFillGeometry = (node: GeometryMixin): boolean => {
  return node.fillGeometry.length > 0;
};

export const transformStrokes = (
  node: GeometryMixin | (GeometryMixin & IndividualStrokesMixin)
): Partial<ShapeAttributes> => {
  return {
    strokes: translateStrokes(
      node,
      hasFillGeometry(node),
      isVectorLike(node) ? node.vectorNetwork : undefined,
      isIndividualStrokes(node) ? node : undefined
    )
  };
};
