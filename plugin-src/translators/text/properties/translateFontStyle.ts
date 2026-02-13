import type { TextFontStyle } from '@ui/lib/types/shapes/textShape';

export const translateFontStyle = (segment: Pick<StyledTextSegment, 'fontName'>): TextFontStyle => {
  if (segment.fontName?.style?.toLowerCase().includes('italic')) {
    return 'italic';
  }

  return 'normal';
};
