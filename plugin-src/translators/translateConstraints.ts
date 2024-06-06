import { ConstraintH, ConstraintV } from '@ui/lib/types/shapes/shape';

export const translateConstraintH = (constraint: ConstraintType): ConstraintH => {
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

export const translateConstraintV = (constraint: ConstraintType): ConstraintV => {
  switch (constraint) {
    case 'MAX':
      return 'bottom';
    case 'MIN':
      return 'top';
    case 'CENTER':
      return 'center';
    case 'SCALE':
      return 'scale';
    case 'STRETCH':
      return 'topbottom';
  }
};
