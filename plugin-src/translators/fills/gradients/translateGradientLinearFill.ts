import { calculateLinearGradient, rgbToHex } from '@plugin/utils';

import { Fill } from '@ui/lib/types/utils/fill';

export const translateGradientLinearFill = (fill: GradientPaint): Fill => {
  const points = calculateLinearGradient(fill.gradientTransform);

  return {
    fillColorGradient: {
      type: 'linear',
      startX: points.start[0],
      startY: points.start[1],
      endX: points.end[0],
      endY: points.end[1],
      width: 1,
      stops: fill.gradientStops.map(stop => ({
        color: rgbToHex(stop.color),
        offset: stop.position,
        opacity: stop.color.a * (fill.opacity ?? 1)
      }))
    },
    fillOpacity: !fill.visible ? 0 : fill.opacity
  };
};
