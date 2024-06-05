import { translateImageFill, translateSolidFill } from '@plugin/translators/fills';
import {
  translateGradientLinearFill,
  translateGradientRadialFill
} from '@plugin/translators/fills/gradients';
import { rgbToHex } from '@plugin/utils';

import { Fill } from '@ui/lib/types/utils/fill';

export const translateFill = (fill: Paint): Fill | undefined => {
  switch (fill.type) {
    case 'SOLID':
      return translateSolidFill(fill);
    case 'GRADIENT_LINEAR':
      return translateGradientLinearFill(fill);
    case 'GRADIENT_RADIAL':
      return translateGradientRadialFill(fill);
    case 'IMAGE':
      return translateImageFill(fill);
  }

  console.error(`Unsupported fill type: ${fill.type}`);
};

export const translateFills = (
  fills: readonly Paint[] | typeof figma.mixed | undefined
): Fill[] => {
  if (fills === undefined || fills === figma.mixed) return [];

  const penpotFills: Fill[] = [];

  for (const fill of fills) {
    const penpotFill = translateFill(fill);

    if (penpotFill) {
      // fills are applied in reverse order in Figma, that's why we unshift
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
