import { translateFills } from '@plugin/translators';
import {
  StyleTextSegment,
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

export const translateStyleTextSegments = (
  node: TextNode,
  segments: StyleTextSegment[]
): PenpotTextNode[] => {
  const partials = segments.map(segment => ({
    textNodes: [translateStyleTextSegment(node, segment)],
    segment
  }));

  return translateParagraphProperties(node, partials);
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
