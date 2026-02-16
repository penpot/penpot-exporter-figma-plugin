export const translateLetterSpacing = (
  segment: Pick<StyledTextSegment, 'letterSpacing' | 'fontSize'>
): string => {
  if (!segment.letterSpacing) return '0';

  switch (segment.letterSpacing.unit) {
    case 'PIXELS':
      return segment.letterSpacing.value.toString();
    case 'PERCENT':
      return ((segment.fontSize * segment.letterSpacing.value) / 100).toString();
    default:
      return '0';
  }
};
