import { Gradient, LINEAR_TYPE, RADIAL_TYPE } from '@ui/lib/types/utils/gradient';

export const createGradientFill = ({ type, ...rest }: Gradient): Gradient | undefined => {
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
