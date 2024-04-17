import { translateFill } from '@plugin/translators/translateFills';

import { Stroke, StrokeCaps } from '@ui/lib/types/utils/stroke';

export const translateStrokes = (
  paints: readonly Paint[],
  strokeWeight: number | typeof figma.mixed,
  hasFillGeometry?: boolean,
  vectorNetwork?: VectorNetwork
): Stroke[] => {
  return paints.map((paint, index) => {
    const fill = translateFill(paint, 0, 0);
    const stroke: Stroke = {
      strokeColor: fill?.fillColor,
      strokeOpacity: fill?.fillOpacity,
      strokeWidth: strokeWeight === figma.mixed ? 1 : strokeWeight
    };

    if (!hasFillGeometry && index === 0 && vectorNetwork && vectorNetwork.vertices.length) {
      stroke.strokeCapStart = translateStrokeCap(vectorNetwork.vertices[0]);
      stroke.strokeCapEnd = translateStrokeCap(
        vectorNetwork.vertices[vectorNetwork.vertices.length - 1]
      );
    }

    return stroke;
  });
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
