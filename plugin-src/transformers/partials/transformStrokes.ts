import { translateStrokes } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

export type NodeStrokes = {
  strokes: readonly Paint[];
  strokeWeight: number | typeof figma.mixed;
  strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE';
  dashPattern: readonly number[];
};

const isVectorLike = (node: GeometryMixin | VectorLikeMixin): node is VectorLikeMixin => {
  return 'vectorNetwork' in node;
};

const isIndividualStrokes = (
  node: DefaultShapeMixin | IndividualStrokesMixin
): node is IndividualStrokesMixin => {
  return 'strokeTopWeight' in node;
};

const hasFillGeometry = (node: GeometryMixin | (GeometryMixin & VectorLikeMixin)): boolean => {
  return node.fillGeometry.length > 0;
};

const getNodeStrokes = (
  node: DefaultShapeMixin | (DefaultShapeMixin & IndividualStrokesMixin)
): NodeStrokes => {
  return {
    strokes: node.strokes,
    strokeWeight: node.strokeWeight,
    strokeAlign: node.strokeAlign,
    dashPattern: node.dashPattern
  };
};

const getIndividualStrokes = (node: IndividualStrokesMixin): IndividualStrokesMixin => {
  return {
    strokeTopWeight: node.strokeTopWeight,
    strokeRightWeight: node.strokeRightWeight,
    strokeBottomWeight: node.strokeBottomWeight,
    strokeLeftWeight: node.strokeLeftWeight
  };
};

export const transformStrokes = (
  node: DefaultShapeMixin | (DefaultShapeMixin & IndividualStrokesMixin)
): Partial<ShapeAttributes> => {
  return {
    strokes: translateStrokes(
      getNodeStrokes(node),
      hasFillGeometry(node),
      isVectorLike(node) ? node.vectorNetwork : undefined,
      isIndividualStrokes(node) ? getIndividualStrokes(node) : undefined
    )
  };
};
