export const translateLineHeight = (
  segment: Pick<StyledTextSegment, 'lineHeight' | 'fontSize'>
): string => {
  if (!segment.lineHeight) return '1.2';

  switch (segment.lineHeight.unit) {
    case 'PIXELS':
      return segment.fontSize ? (segment.lineHeight.value / segment.fontSize).toString() : '1.2';
    case 'PERCENT':
      return (segment.lineHeight.value / 100).toString();
    default:
      return '1.2';
  }
};
