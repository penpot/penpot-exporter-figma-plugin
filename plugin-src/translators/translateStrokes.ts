import { translateFill } from '@plugin/translators/fills';

import { Stroke, StrokeAlignment, StrokeCaps } from '@ui/lib/types/utils/stroke';

export const translateStrokes = async (
  node: MinimalStrokesMixin | (MinimalStrokesMixin & IndividualStrokesMixin),
  strokeCaps: (stroke: Stroke) => Stroke = stroke => stroke
): Promise<Stroke[]> => {
  const sharedStrokeProperties: Partial<Stroke> = {
    strokeWidth: translateStrokeWeight(node),
    strokeAlignment: translateStrokeAlignment(node.strokeAlign),
    strokeStyle: node.dashPattern.length ? 'dashed' : 'solid'
  };

  return await Promise.all(
    node.strokes.map(
      async (paint, index) =>
        await translateStroke(paint, sharedStrokeProperties, strokeCaps, index === 0)
    )
  );
};

export const translateStroke = async (
  paint: Paint,
  sharedStrokeProperties: Partial<Stroke>,
  strokeCaps: (stroke: Stroke) => Stroke,
  firstStroke: boolean
): Promise<Stroke> => {
  const fill = await translateFill(paint);

  let stroke: Stroke = {
    strokeColor: fill?.fillColor,
    strokeOpacity: fill?.fillOpacity,
    strokeImage: fill?.fillImage,
    ...sharedStrokeProperties
  };

  if (firstStroke) {
    stroke = strokeCaps(stroke);
  }

  return stroke;
};

export const translateStrokeCap = (vertex: VectorVertex): StrokeCaps | undefined => {
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

const translateStrokeWeight = (
  node: MinimalStrokesMixin | (MinimalStrokesMixin & IndividualStrokesMixin)
): number => {
  if (node.strokeWeight !== figma.mixed) {
    return node.strokeWeight;
  }

  if (!isIndividualStrokes(node)) {
    return 1;
  }

  return Math.max(
    node.strokeTopWeight,
    node.strokeRightWeight,
    node.strokeBottomWeight,
    node.strokeLeftWeight
  );
};

const isIndividualStrokes = (
  node: MinimalStrokesMixin | IndividualStrokesMixin
): node is IndividualStrokesMixin => {
  return 'strokeTopWeight' in node;
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
