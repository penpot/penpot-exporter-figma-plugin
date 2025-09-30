import { rgbToHex } from '@plugin/utils';

import type { Fill } from '@ui/lib/types/utils/fill';

export const translateSolidFill = (fill: SolidPaint): Fill => {
  return {
    fillColor: rgbToHex(fill.color),
    fillOpacity: !fill.visible ? 0 : fill.opacity
  };
};
