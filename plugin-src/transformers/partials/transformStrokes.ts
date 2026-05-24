import type { Command } from 'svg-path-parser';

import { translateStrokeCap, translateStrokes } from '@plugin/translators';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';
import type { Stroke } from '@ui/lib/types/utils/stroke';

const isVectorLike = (node: GeometryMixin | VectorLikeMixin): node is VectorLikeMixin => {
  return 'vectorNetwork' in node;
};

const hasFillGeometry = (node: GeometryMixin): boolean => {
  return node.fillGeometry.length > 0;
};

const safeGetVectorNetwork = (node: VectorLikeMixin): VectorNetwork | undefined => {
  try {
    return node.vectorNetwork;
  } catch (error) {
    console.warn('Could not access the vector network', error);
    return undefined;
  }
};

export const transformStrokes = (
  node: GeometryMixin | (GeometryMixin & IndividualStrokesMixin)
): Pick<ShapeAttributes, 'strokes'> => {
  const vectorNetwork = isVectorLike(node) ? safeGetVectorNetwork(node) : undefined;

  const strokeCaps = (stroke: Stroke): Stroke => {
    if (!hasFillGeometry(node) && vectorNetwork && vectorNetwork.vertices.length > 0) {
      stroke.strokeCapStart = translateStrokeCap(vectorNetwork.vertices[0]);
      stroke.strokeCapEnd = translateStrokeCap(
        vectorNetwork.vertices[vectorNetwork.vertices.length - 1]
      );
    }

    return stroke;
  };

  return {
    strokes: translateStrokes(node, strokeCaps)
  };
};

export const transformStrokesFromVector = (
  node: VectorNode,
  vector: Command[],
  vectorRegion: VectorRegion | undefined,
  vectorNetwork: VectorNetwork | undefined
): Pick<ShapeAttributes, 'strokes'> => {
  const strokeCaps = (stroke: Stroke): Stroke => {
    if (vectorRegion !== undefined) return stroke;
    if (!vectorNetwork) return stroke;

    const startVertex = findVertex(vectorNetwork.vertices, vector[0]);
    const endVertex = findVertex(vectorNetwork.vertices, vector[vector.length - 1]);

    if (!startVertex || !endVertex) return stroke;

    stroke.strokeCapStart = translateStrokeCap(startVertex);
    stroke.strokeCapEnd = translateStrokeCap(endVertex);

    return stroke;
  };

  return {
    strokes: translateStrokes(node, strokeCaps)
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
