import { translateFill } from '@plugin/translators/translateFills';

import { Stroke, StrokeAlignment, StrokeCaps } from '@ui/lib/types/utils/stroke';

export const translateStrokes = (
  nodeStrokes: MinimalStrokesMixin,
  hasFillGeometry?: boolean,
  vectorNetwork?: VectorNetwork,
  individualStrokes?: IndividualStrokesMixin
): Stroke[] => {
  return nodeStrokes.strokes.map((paint, index) => {
    const fill = translateFill(paint, 0, 0);
    const stroke: Stroke = {
      strokeColor: fill?.fillColor,
      strokeOpacity: fill?.fillOpacity,
      strokeWidth: translateStrokeWeight(nodeStrokes.strokeWeight, individualStrokes),
      strokeAlignment: translateStrokeAlignment(nodeStrokes.strokeAlign),
      strokeStyle: nodeStrokes.dashPattern.length ? 'dashed' : 'solid'
    };

    if (!hasFillGeometry && index === 0 && vectorNetwork && vectorNetwork.vertices.length > 0) {
      stroke.strokeCapStart = translateStrokeCap(vectorNetwork.vertices[0]);
      stroke.strokeCapEnd = translateStrokeCap(
        vectorNetwork.vertices[vectorNetwork.vertices.length - 1]
      );
    }

    return stroke;
  });
};

const translateStrokeWeight = (
  strokeWeight: number | typeof figma.mixed,
  individualStrokes?: IndividualStrokesMixin
): number => {
  if (strokeWeight !== figma.mixed) {
    return strokeWeight;
  }

  if (!individualStrokes) {
    return 1;
  }

  return Math.max(
    individualStrokes.strokeTopWeight,
    individualStrokes.strokeRightWeight,
    individualStrokes.strokeBottomWeight,
    individualStrokes.strokeLeftWeight
  );
};

const translateStrokeAlignment = (
  strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE'
): StrokeAlignment => {
  switch (strokeAlign) {
    case 'CENTER':
      return 'center';
    case 'INSIDE':
      return 'inner';
    case 'OUTSIDE':
      return 'outer';
  }
};

const translateStrokeCap = (vertex: VectorVertex): StrokeCaps | undefined => {
  switch (vertex.strokeCap as StrokeCap | ConnectorStrokeCap) {
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
      return 'line-arrow';
    case 'NONE':
    default:
      return;
  }
};
