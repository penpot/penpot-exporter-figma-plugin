import { translateFills } from '@plugin/translators';
import {
  translateFontId,
  translateFontStyle,
  translateHorizontalAlign,
  translateLetterSpacing,
  translateLineHeight,
  translateParagraphProperties,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators/text';

import { TextNode as PenpotTextNode, TextStyle } from '@ui/lib/types/text/textContent';

type StyleTextSegment = Pick<
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
>;

export const translateStyleTextSegments = (
  node: TextNode,
  segments: StyleTextSegment[]
): PenpotTextNode[] => {
  const textNodes = segments.map(segment => {
    return translateStyleTextSegment(node, segment);
  });

  return translateParagraphProperties(node, textNodes);
};

export const transformTextStyle = (
  node: TextNode,
  segment: StyleTextSegment
): Partial<TextStyle> => {
  return {
    ...translateFontId(segment.fontName, segment.fontWeight),
    fontFamily: segment.fontName.family,
    fontSize: segment.fontSize.toString(),
    fontStyle: translateFontStyle(segment.fontName.style),
    fontWeight: segment.fontWeight.toString(),
    textAlign: translateHorizontalAlign(node.textAlignHorizontal),
    textDecoration: translateTextDecoration(segment),
    textTransform: translateTextTransform(segment),
    letterSpacing: translateLetterSpacing(segment),
    lineHeight: translateLineHeight(segment)
  };
};

const translateStyleTextSegment = (node: TextNode, segment: StyleTextSegment): PenpotTextNode => {
  return {
    fills: translateFills(segment.fills, node.width, node.height),
    text: segment.characters,
    ...transformTextStyle(node, segment)
  };
};
