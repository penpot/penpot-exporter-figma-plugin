import { TextFontStyle } from '@ui/lib/types/text/textContent';

export const translateFontStyle = (style: string): TextFontStyle => {
  if (style.toLowerCase().includes('italic')) {
    return 'italic';
  }

  return 'normal';
};
