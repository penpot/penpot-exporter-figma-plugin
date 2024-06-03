import {
  BOOL_DIFFERENCE,
  BOOL_EXCLUDE,
  BOOL_INTERSECTION,
  BOOL_UNION,
  BoolOperations
} from '@ui/lib/types/shapes/boolShape';

export const symbolBoolType = (booleanOperation: BoolOperations): BoolOperations => {
  if (typeof booleanOperation !== 'string') return booleanOperation;

  switch (booleanOperation) {
    case 'union':
      return BOOL_UNION;
    case 'exclude':
      return BOOL_EXCLUDE;
    case 'difference':
      return BOOL_DIFFERENCE;
    case 'intersection':
      return BOOL_INTERSECTION;
  }
};
