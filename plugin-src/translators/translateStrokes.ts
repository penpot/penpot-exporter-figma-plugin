import { translateFill } from '@plugin/translators/translateFills';

import { Stroke, StrokeCaps } from '@ui/lib/types/utils/stroke';

export const translateStrokes = (
  paints: readonly Paint[],
  strokeWeight: number | typeof figma.mixed,
  vectorNetwork?: VectorNetwork
): Stroke[] => {
  const strokes = paints.map(paint => {
    const fill = translateFill(paint, 0, 0);

    return {
      strokeColor: fill?.fillColor,
      strokeOpacity: fill?.fillOpacity,
      strokeWidth: strokeWeight === figma.mixed ? 1 : strokeWeight
    } as Stroke;
  });

  if (vectorNetwork && vectorNetwork.vertices.length === 2) {
    strokes[0].strokeCapStart = translateStrokeCap(vectorNetwork.vertices[0]);
    strokes[0].strokeCapEnd = translateStrokeCap(vectorNetwork.vertices[1]);
  }

  return strokes;
};

const translateStrokeCap = (vertex: VectorVertex): StrokeCaps | undefined => {
  switch (vertex.strokeCap as StrokeCap | ConnectorStrokeCap) {
    case 'NONE':
      return;
    case 'ROUND':
      return 'round';
    case 'ARROW_EQUILATERAL':
    case 'TRIANGLE_FILLED':
      return 'triangle-arrow';
    case 'SQUARE':
      return 'square';
    case 'CIRCLE_FILLED':
      return 'circle-marker';
    case 'DIAMOND_FILLED':
      return 'diamond-marker';
    case 'ARROW_LINES':
    default:
      return 'line-arrow';
  }
};
