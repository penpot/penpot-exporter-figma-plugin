import { Fill } from '@ui/lib/types/utils/fill';
import { Gradient, LINEAR_TYPE, RADIAL_TYPE } from '@ui/lib/types/utils/gradient';

export const symbolFillGradients = (fills?: Fill[]): Fill[] | undefined => {
  if (!fills) return;

  return fills.map(fill => {
    if (fill.fillColorGradient) {
      fill.fillColorGradient = symbolFillGradient(fill.fillColorGradient);
    }

    return fill;
  });
};

const symbolFillGradient = ({ type, ...rest }: Gradient): Gradient | undefined => {
  switch (type) {
    case 'linear':
      return {
        type: LINEAR_TYPE,
        ...rest
      };
    case 'radial':
      return {
        type: RADIAL_TYPE,
        ...rest
      };
  }

  console.error(`Unsupported gradient type: ${String(type)}`);
};
