type StyledTextSegmentField = keyof Omit<StyledTextSegment, 'characters' | 'start' | 'end'>;

export const STYLED_TEXT_SEGMENT_FIELDS: StyledTextSegmentField[] = [
  'fontName',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textCase',
  'textDecoration',
  'indentation',
  'listOptions',
  'fills',
  'fillStyleId',
  'textStyleId'
];
