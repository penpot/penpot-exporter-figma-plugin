export const translateTextDecoration = (segment: Pick<StyledTextSegment, 'textDecoration'>) => {
  switch (segment.textDecoration) {
    case 'STRIKETHROUGH':
      return 'line-through';
    case 'UNDERLINE':
      return 'underline';
    default:
      return 'none';
  }
};
