import { TextData, TextDataChildren } from '../interfaces.js';

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
