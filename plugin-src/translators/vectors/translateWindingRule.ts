import { FillRules } from '@ui/lib/types/shapes/pathShape';

export const translateWindingRule = (windingRule: WindingRule | 'NONE'): FillRules | undefined => {
  switch (windingRule) {
    case 'EVENODD':
      return 'evenodd';
    case 'NONZERO':
      return 'nonzero';
  }
};
