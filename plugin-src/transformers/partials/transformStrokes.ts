import { translateStrokeCap, translateStrokes } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';
import { Stroke } from '@ui/lib/types/utils/stroke';

const isVectorLike = (node: GeometryMixin | VectorLikeMixin): node is VectorLikeMixin => {
  return 'vectorNetwork' in node;
};

const hasFillGeometry = (node: GeometryMixin): boolean => {
  return node.fillGeometry.length > 0;
};

export const transformStrokes = async (
  node: GeometryMixin | (GeometryMixin & IndividualStrokesMixin)
): Promise<Partial<ShapeAttributes>> => {
  const vectorNetwork = isVectorLike(node) ? node.vectorNetwork : undefined;

  const strokeCaps = (stroke: Stroke) => {
    if (!hasFillGeometry(node) && vectorNetwork && vectorNetwork.vertices.length > 0) {
      stroke.strokeCapStart = translateStrokeCap(vectorNetwork.vertices[0]);
      stroke.strokeCapEnd = translateStrokeCap(
        vectorNetwork.vertices[vectorNetwork.vertices.length - 1]
      );
    }

    return stroke;
  };

  return {
    strokes: await translateStrokes(node, strokeCaps)
  };
};
