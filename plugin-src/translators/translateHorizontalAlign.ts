import { TextHorizontalAlign } from '@ui/lib/types/text/textContent';

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
