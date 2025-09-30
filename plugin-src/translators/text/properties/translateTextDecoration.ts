export const translateTextDecoration = (
  segment: Pick<StyledTextSegment, 'textDecoration'>
): 'line-through' | 'underline' | 'none' => {
  switch (segment.textDecoration) {
    case 'STRIKETHROUGH':
      return 'line-through';
    case 'UNDERLINE':
      return 'underline';
    default:
      return 'none';
  }
};
