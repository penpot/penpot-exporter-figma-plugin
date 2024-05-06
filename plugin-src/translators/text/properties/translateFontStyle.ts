import { TextFontStyle } from '@ui/lib/types/shapes/textShape';

export const translateFontStyle = (style: string): TextFontStyle => {
  if (style.toLowerCase().includes('italic')) {
    return 'italic';
  }

  return 'normal';
};
