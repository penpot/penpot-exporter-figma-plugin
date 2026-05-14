import { paintStyles } from '@plugin/libraries';
import { translateImageFill, translateSolidFill } from '@plugin/translators/fills';
import {
  translateGradientLinearFill,
  translateGradientRadialFill
} from '@plugin/translators/fills/gradients';
import { isFigJamEditor, rgbToHex } from '@plugin/utils';

import type { Fill } from '@ui/lib/types/utils/fill';

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

  console.warn(`Unsupported fill type: ${fill.type}`);
};

export const translateFills = (
  fills: readonly Paint[] | typeof figma.mixed | undefined
): Fill[] => {
  if (fills === undefined || fills === figma.mixed) return [];

  const penpotFills: Fill[] = [];

  for (const fill of fills) {
    const penpotFill = translateFill(fill);

    if (penpotFill) {
      penpotFills.push(penpotFill);
    }
  }

  // fills are applied in reverse order in Figma
  return penpotFills.reverse();
};

export const translateFillStyleId = (
  fillStyleId: string | typeof figma.mixed | undefined
): string | undefined => {
  if (fillStyleId === figma.mixed || fillStyleId === undefined) return;

  // FigJam has no design styles and exposes no style APIs, so registering a
  // fillStyleId would just create a dangling reference and crash processPaintStyles.
  if (isFigJamEditor()) return;

  if (!paintStyles.has(fillStyleId)) {
    paintStyles.set(fillStyleId, undefined);
  }

  return fillStyleId;
};

export const translatePageFill = (fill: Paint): string | undefined => {
  switch (fill.type) {
    case 'SOLID':
      return rgbToHex(fill.color);
  }

  console.warn(`Unsupported page fill type: ${fill.type}`);
};
