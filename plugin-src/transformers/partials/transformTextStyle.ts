import {
  translateFontId,
  translateFontStyle,
  translateFontVariantId,
  translateHorizontalAlign,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators';

import { TextStyle } from '@ui/lib/types/text/textContent';

export const transformTextStyle = (
  node: TextNode,
  segment: Pick<
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
): Partial<TextStyle> => {
  return {
    fontFamily: segment.fontName.family,
    fontId: translateFontId(segment.fontName),
    fontSize: segment.fontSize.toString(),
    fontStyle: translateFontStyle(segment.fontName.style),
    fontWeight: segment.fontWeight.toString(),
    fontVariantId: translateFontVariantId(segment.fontName, segment.fontWeight),
    textAlign: translateHorizontalAlign(node.textAlignHorizontal),
    textDecoration: translateTextDecoration(segment),
    textTransform: translateTextTransform(segment),
    letterSpacing: translateLetterSpacing(segment),
    lineHeight: translateLineHeight(segment)
  };
};
