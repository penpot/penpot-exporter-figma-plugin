import { Constraint } from '@ui/lib/types/shapes/shape';

export const translateConstraint = (constraint: ConstraintType): Constraint => {
  switch (constraint) {
    case 'MAX':
      return 'right';
    case 'MIN':
      return 'left';
    case 'CENTER':
      return 'center';
    case 'SCALE':
      return 'scale';
    case 'STRETCH':
      return 'leftright';
  }
};
