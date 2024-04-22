import { rgbToHex } from '@plugin/utils';
import { calculateLinearGradient } from '@plugin/utils/calculateLinearGradient';

import { Fill } from '@ui/lib/types/utils/fill';

export const translateFill = (fill: Paint, width: number, height: number): Fill | undefined => {
  switch (fill.type) {
    case 'SOLID':
      return translateSolidFill(fill);
    case 'GRADIENT_LINEAR':
      return translateGradientLinearFill(fill, width, height);
  }

  console.error(`Unsupported fill type: ${fill.type}`);
};

export const translateFills = (
  fills: readonly Paint[] | typeof figma.mixed,
  width: number,
  height: number
): Fill[] => {
  const figmaFills = fills === figma.mixed ? [] : fills;
  const penpotFills: Fill[] = [];

  for (const fill of figmaFills) {
    const penpotFill = translateFill(fill, width, height);
    if (penpotFill) {
      // colors are applied in reverse order in Figma, that's why we unshift
      penpotFills.unshift(penpotFill);
    }
  }

  return penpotFills;
};

export const translatePageFill = (fill: Paint): string | undefined => {
  switch (fill.type) {
    case 'SOLID':
      return rgbToHex(fill.color);
  }

  console.error(`Unsupported page fill type: ${fill.type}`);
};

const translateSolidFill = (fill: SolidPaint): Fill => {
  return {
    fillColor: rgbToHex(fill.color),
    fillOpacity: !fill.visible ? 0 : fill.opacity
  };
};

const translateGradientLinearFill = (fill: GradientPaint, width: number, height: number): Fill => {
  const points = calculateLinearGradient(width, height, fill.gradientTransform);

  return {
    fillColorGradient: {
      type: 'linear',
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
