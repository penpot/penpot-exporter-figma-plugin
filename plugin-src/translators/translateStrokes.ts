import { translateFill } from '@plugin/translators/translateFills';

import { Stroke } from '@ui/lib/types/utils/stroke';

export const translateStrokes = (node: MinimalStrokesMixin): Stroke[] => {
  return node.strokes.map(stroke => {
    const fill = translateFill(stroke, 0, 0);
    return {
      strokeColor: fill?.fillColor,
      strokeOpacity: fill?.fillOpacity,
      strokeWidth: node.strokeWeight === figma.mixed ? 1 : node.strokeWeight
    };
  });
};
