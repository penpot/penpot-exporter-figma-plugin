export const translateLineHeight = (
  segment: Pick<StyledTextSegment, 'lineHeight' | 'fontSize'>
): number | undefined => {
  switch (segment.lineHeight.unit) {
    case 'PIXELS':
      return segment.lineHeight.value / segment.fontSize;
    case 'PERCENT':
      return segment.lineHeight.value / 100;
  }
};
