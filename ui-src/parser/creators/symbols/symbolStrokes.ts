import { Stroke } from '@ui/lib/types/utils/stroke';

import { symbolFillImage } from '.';

export const symbolStrokes = (strokes?: Stroke[]): Stroke[] | undefined => {
  if (!strokes) return;

  return strokes.map(stroke => {
    if (stroke['stroke-image']) {
      stroke['stroke-image'] = symbolFillImage(stroke['stroke-image']);
    }

    return stroke;
  });
};
