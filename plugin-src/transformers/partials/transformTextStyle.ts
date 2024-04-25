import slugify from 'slugify';

import {
  translateFontStyle,
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
    fontId: `gfont-${slugify(segment.fontName.family.toLowerCase())}`,
    fontSize: segment.fontSize.toString(),
    fontStyle: segment.fontName.style,
    fontWeight: segment.fontWeight.toString(),
    fontVariantId: translateFontStyle(segment.fontName.style),
    textAlign: translateHorizontalAlign(node.textAlignHorizontal),
    textDecoration: translateTextDecoration(segment),
    textTransform: translateTextTransform(segment),
    letterSpacing: translateLetterSpacing(segment),
    lineHeight: translateLineHeight(segment)
  };
};
