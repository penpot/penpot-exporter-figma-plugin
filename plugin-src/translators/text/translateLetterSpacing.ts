export const translateLetterSpacing = (
  segment: Pick<StyledTextSegment, 'letterSpacing' | 'fontSize'>
): number => {
  switch (segment.letterSpacing.unit) {
    case 'PIXELS':
      return segment.letterSpacing.value;
    case 'PERCENT':
      return (segment.fontSize * segment.letterSpacing.value) / 100;
    default:
      return 0;
  }
};
