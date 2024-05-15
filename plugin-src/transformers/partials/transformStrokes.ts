import { Command } from 'svg-path-parser';

import { translateStrokeCap, translateStrokes } from '@plugin/translators';

// import { PartialVectorNetwork } from '@plugin/translators/vectors/splitVectorNetwork';
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

// export const transformStrokesFromVectorNetwork = async (
//   node: VectorNode,
//   partialVectorNetwork: PartialVectorNetwork
// ): Promise<Partial<ShapeAttributes>> => {
//   const strokeCaps = (stroke: Stroke) => {
//     if (partialVectorNetwork.region !== undefined) return stroke;

//     const startVertex = node.vectorNetwork.vertices[partialVectorNetwork.segments[0].start];
//     const endVertex =
//       node.vectorNetwork.vertices[
//         partialVectorNetwork.segments[partialVectorNetwork.segments.length - 1].end
//       ];

//     stroke.strokeCapStart = translateStrokeCap(startVertex);
//     stroke.strokeCapEnd = translateStrokeCap(endVertex);

//     return stroke;
//   };

//   return {
//     strokes: await translateStrokes(node, strokeCaps)
//   };
// };

export const transformStrokesFromVector = async (
  node: VectorNode,
  vector: Command[],
  vectorRegion: VectorRegion | undefined
): Promise<Partial<ShapeAttributes>> => {
  const strokeCaps = (stroke: Stroke) => {
    if (vectorRegion !== undefined) return stroke;

    const startVertex = findVertex(node.vectorNetwork.vertices, vector[0]);
    const endVertex = findVertex(node.vectorNetwork.vertices, vector[vector.length - 1]);

    if (!startVertex || !endVertex) return stroke;

    stroke.strokeCapStart = translateStrokeCap(startVertex);
    stroke.strokeCapEnd = translateStrokeCap(endVertex);

    return stroke;
  };

  return {
    strokes: await translateStrokes(node, strokeCaps)
  };
};

const findVertex = (
  vertexs: readonly VectorVertex[],
  command: Command
): VectorVertex | undefined => {
  if (command.command !== 'moveto' && command.command !== 'lineto' && command.command !== 'curveto')
    return;

  return vertexs.find(vertex => vertex.x === command.x && vertex.y === command.y);
};
