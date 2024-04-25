export const translateLineHeight = (
  segment: Pick<StyledTextSegment, 'lineHeight' | 'fontSize'>
): number => {
  // Penpot reads lineHeight as a multiplier of the font size
  switch (segment.lineHeight.unit) {
    case 'PIXELS':
      return segment.lineHeight.value / segment.fontSize;
    case 'PERCENT':
      return segment.lineHeight.value / 100;
    default:
      return 1.2; // This is the most common auto value for line-height
  }
};
