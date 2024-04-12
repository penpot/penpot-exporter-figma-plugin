import { Gradient, LINEAR_TYPE, RADIAL_TYPE } from '@ui/lib/types/utils/gradient';

export const createGradientFill = ({ type, ...rest }: Gradient): Gradient => {
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

  throw new Error(`Unsupported gradient type: ${String(type)}`);
};
