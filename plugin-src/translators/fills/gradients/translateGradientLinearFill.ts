import { calculateLinearGradient, rgbToHex } from '@plugin/utils';

import { Fill } from '@ui/lib/types/utils/fill';

export const translateGradientLinearFill = (fill: GradientPaint): Fill => {
  const points = calculateLinearGradient(fill.gradientTransform);

  return {
    'fill-color-gradient': {
      'type': 'linear',
      'start-x': points.start[0],
      'start-y': points.start[1],
      'end-x': points.end[0],
      'end-y': points.end[1],
      'width': 1,
      'stops': fill.gradientStops.map(stop => ({
        color: rgbToHex(stop.color),
        offset: stop.position,
        opacity: stop.color.a * (fill.opacity ?? 1)
      }))
    },
    'fill-opacity': !fill.visible ? 0 : fill.opacity
  };
};
