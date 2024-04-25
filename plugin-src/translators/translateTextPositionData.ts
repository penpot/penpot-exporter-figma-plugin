import { PositionData } from '@ui/lib/types/text/textAttributes';
import { TextNode } from '@ui/lib/types/text/textContent';

export const translateTextPositionData = (segments: TextNode[]): PositionData[] => {
  return segments.map((segment): PositionData => {
    return {
      fills: segment.fills,
      fontFamily: segment.fontFamily,
      fontSize: segment.fontSize,
      fontStyle: segment.fontStyle,
      fontWeight: segment.fontWeight,
      rtl: segment.direction === 'rtl',
      text: segment.text,
      textDecoration: segment.textDecoration,
      textTransform: segment.textTransform
    };
  });
};
