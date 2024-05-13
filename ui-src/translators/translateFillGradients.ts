import { Fill } from '@ui/lib/types/utils/fill';
import { Gradient, LINEAR_TYPE, RADIAL_TYPE } from '@ui/lib/types/utils/gradient';

export const translateFillGradients = (fills?: Fill[]): Fill[] | undefined => {
  if (!fills) return;

  return fills.map(fill => {
    if (fill.fillColorGradient) {
      fill.fillColorGradient = translateFillGradient(fill.fillColorGradient);
    }

    return fill;
  });
};

const translateFillGradient = ({ type, ...rest }: Gradient): Gradient | undefined => {
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
