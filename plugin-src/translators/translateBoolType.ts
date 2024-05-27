import { BoolOperations } from '@ui/lib/types/shapes/boolShape';

type BooleanOperation = 'UNION' | 'INTERSECT' | 'SUBTRACT' | 'EXCLUDE';
export const translateBoolType = (booleanOperation: BooleanOperation): BoolOperations => {
  switch (booleanOperation) {
    case 'EXCLUDE':
      return 'exclude';
    case 'INTERSECT':
      return 'intersection';
    case 'SUBTRACT':
      return 'difference';
    case 'UNION':
      return 'union';
  }
};
