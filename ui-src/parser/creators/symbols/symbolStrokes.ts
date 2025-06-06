import { PenpotContext } from '@ui/lib/types/penpotContext';
import { Stroke } from '@ui/lib/types/utils/stroke';
import { symbolFillImage } from '@ui/parser/creators/symbols';

export const symbolStrokes = (context: PenpotContext, strokes?: Stroke[]): Stroke[] | undefined => {
  if (!strokes) return;

  return strokes.map(stroke => {
    if (stroke.strokeImage) {
      const strokeImage = symbolFillImage(context, stroke.strokeImage);
      if (strokeImage) {
        stroke.strokeImage = strokeImage;
      }
    }

    return stroke;
  });
};
