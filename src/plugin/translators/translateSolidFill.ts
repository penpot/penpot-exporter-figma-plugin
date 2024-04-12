import { Fill } from '../../ui/lib/types/utils/fill';
import { rgbToHex } from '../utils';

export const translateSolidFill = (fill: SolidPaint): Fill => {
  return {
    fillColor: rgbToHex(fill.color),
    fillOpacity: fill.visible === false ? 0 : fill.opacity
  };
};
