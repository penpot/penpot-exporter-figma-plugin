import { TextData, TextDataChildren } from '../../common/interfaces';

export const translateTextDecoration = (node: TextData | TextDataChildren) => {
  const textDecoration = node.textDecoration;
  if (textDecoration === 'STRIKETHROUGH') {
    return 'line-through';
  }
  if (textDecoration === 'UNDERLINE') {
    return 'underline';
  }
  return 'none';
};
