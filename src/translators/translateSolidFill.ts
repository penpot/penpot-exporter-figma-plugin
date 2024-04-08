import { rgbToHex } from '../utils';

export const translateSolidFill = (fill: SolidPaint) => {
  return {
    fillColor: rgbToHex(fill.color),
    fillOpacity: fill.visible === false ? 0 : fill.opacity
  };
};
