import { Stroke, StrokeImage } from '@ui/lib/types/utils/stroke';

import { symbolFillImage } from '.';

export const symbolStrokes = (strokes?: Stroke[]): Stroke[] | StrokeImage[] | undefined => {
  if (!strokes) return;

  return strokes.map(stroke => {
    if (isStrokeImage(stroke)) {
      const strokeImage = symbolFillImage(stroke.strokeImage);
      if (strokeImage) {
        stroke.strokeImage = strokeImage;
      }
    }

    return stroke;
  });
};

const isStrokeImage = (stroke: Stroke): stroke is StrokeImage => {
  return !!(stroke as StrokeImage).strokeImage;
};
