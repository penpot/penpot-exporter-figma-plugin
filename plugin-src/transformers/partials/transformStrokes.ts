import { translateStrokeCap, translateStrokes } from '@plugin/translators';
import { PartialVectorNetwork } from '@plugin/translators/vectors/splitVectorNetwork';

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

export const transformStrokesFromVectorNetwork = async (
  node: VectorNode,
  partialVectorNetwork: PartialVectorNetwork
): Promise<Partial<ShapeAttributes>> => {
  const strokeCaps = (stroke: Stroke) => {
    if (partialVectorNetwork.region !== undefined) return stroke;

    const startVertex = node.vectorNetwork.vertices[partialVectorNetwork.segments[0].start];
    const endVertex =
      node.vectorNetwork.vertices[
        partialVectorNetwork.segments[partialVectorNetwork.segments.length - 1].end
      ];

    stroke.strokeCapStart = translateStrokeCap(startVertex);
    stroke.strokeCapEnd = translateStrokeCap(endVertex);

    return stroke;
  };

  return {
    strokes: await translateStrokes(node, strokeCaps)
  };
};
