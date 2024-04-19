import { createGradientFill } from '@ui/converters/createGradientFill';
import { Fill } from '@ui/lib/types/utils/fill';

export const translateFillGradients = (fills?: Fill[]): Fill[] | undefined => {
  if (!fills) return fills;
  return fills.map(fill => {
    if (fill.fillColorGradient) {
      fill.fillColorGradient = createGradientFill(fill.fillColorGradient);
    }

    return fill;
  });
};
