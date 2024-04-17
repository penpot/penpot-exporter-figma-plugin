import { translateStrokes } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

export const transformStrokes = (
  node: MinimalStrokesMixin | (MinimalStrokesMixin & VectorLikeMixin)
): Partial<ShapeAttributes> => {
  return {
    strokes: translateStrokes(
      node.strokes,
      node.strokeWeight,
      'vectorNetwork' in node ? node.vectorNetwork : undefined
    )
  };
};
