export const translateTextTransform = (segment: Pick<StyledTextSegment, 'textCase'>) => {
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
