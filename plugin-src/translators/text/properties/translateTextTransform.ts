export const translateTextTransform = (
  segment: Pick<StyledTextSegment, 'textCase'>
): 'uppercase' | 'lowercase' | 'capitalize' | 'none' => {
  switch (segment.textCase) {
    case 'UPPER':
      return 'uppercase';
    case 'LOWER':
      return 'lowercase';
    case 'TITLE':
      return 'capitalize';
    default:
      return 'none';
  }
};
