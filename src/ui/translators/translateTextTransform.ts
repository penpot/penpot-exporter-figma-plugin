import { TextData, TextDataChildren } from '../../common/interfaces';

export const translateTextTransform = (node: TextData | TextDataChildren) => {
  const textCase = node.textCase;
  if (textCase === 'UPPER') {
    return 'uppercase';
  }
  if (textCase === 'LOWER') {
    return 'lowercase';
  }
  if (textCase === 'TITLE') {
    return 'capitalize';
  }
  return 'none';
};
