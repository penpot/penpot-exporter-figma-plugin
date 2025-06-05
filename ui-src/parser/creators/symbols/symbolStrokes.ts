import { PenpotContext } from '@ui/lib/types/penpotContext';
import { Stroke, StrokeImage } from '@ui/lib/types/utils/stroke';
import { symbolFillImage } from '@ui/parser/creators/symbols';

export const symbolStrokes = (
  context: PenpotContext,
  strokes?: Stroke[]
): Stroke[] | StrokeImage[] | undefined => {
  if (!strokes) return;

  return strokes.map(stroke => {
    if (isStrokeImage(stroke)) {
      const strokeImage = symbolFillImage(context, stroke.strokeImage);
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
