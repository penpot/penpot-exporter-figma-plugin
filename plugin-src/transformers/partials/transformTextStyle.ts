import { translateTextDecoration, translateTextTransform } from '@plugin/translators';

import { Paragraph, TextNode } from '@ui/lib/types/text/textContent';

export const transformTextStyle = (
  node: Pick<
    StyledTextSegment,
    | 'characters'
    | 'start'
    | 'end'
    | 'fontName'
    | 'fontSize'
    | 'fontWeight'
    | 'lineHeight'
    | 'letterSpacing'
    | 'textCase'
    | 'textDecoration'
    | 'fills'
  >
): Partial<Paragraph> | Partial<TextNode> => {
  return {
    fontFamily: node.fontName.family,
    fontSize: node.fontSize.toString(),
    fontStyle: node.fontName.style,
    fontWeight: node.fontWeight.toString(),
    textDecoration: translateTextDecoration(node),
    textTransform: translateTextTransform(node)
  };
};
