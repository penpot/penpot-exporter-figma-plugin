import { TextHorizontalAlign } from '@ui/lib/types/shapes/textShape';

export const translateHorizontalAlign = (
  align: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
): TextHorizontalAlign => {
  switch (align) {
    case 'RIGHT':
      return 'right';
    case 'CENTER':
      return 'center';
    case 'JUSTIFIED':
      return 'justify';
    default:
      return 'left';
  }
};
