import { extractLinearGradientParamsFromTransform } from '@figma-plugin/helpers';

import { Fill } from '../lib/types/utils/fill';
import { rgbToHex } from '../utils';

export const translateGradientLinearFill = (
  fill: GradientPaint,
  width: number,
  height: number
): Fill => {
  const points = extractLinearGradientParamsFromTransform(width, height, fill.gradientTransform);
  return {
    fillColorGradient: {
      type: Symbol.for('linear'),
      startX: points.start[0] / width,
      startY: points.start[1] / height,
      endX: points.end[0] / width,
      endY: points.end[1] / height,
      width: 1,
      stops: [
        {
          color: rgbToHex(fill.gradientStops[0].color),
          offset: fill.gradientStops[0].position,
          opacity: fill.gradientStops[0].color.a * (fill.opacity ?? 1)
        },
        {
          color: rgbToHex(fill.gradientStops[1].color),
          offset: fill.gradientStops[1].position,
          opacity: fill.gradientStops[1].color.a * (fill.opacity ?? 1)
        }
      ]
    },
    fillOpacity: fill.visible === false ? 0 : undefined
  };
};
