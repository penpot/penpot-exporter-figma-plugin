import { rgbToHex } from '@plugin/utils';

import { Fill } from '@ui/lib/types/utils/fill';

export const translateSolidFill = (fill: SolidPaint): Fill => {
  return {
    'fill-color': rgbToHex(fill.color),
    'fill-opacity': !fill.visible ? 0 : fill.opacity
  };
};
