import { translateFills } from '@plugin/translators/fills';
import { translateFontId } from '@plugin/translators/text/font';
import { StyleTextSegment, translateParagraphProperties } from '@plugin/translators/text/paragraph';
import {
  translateFontStyle,
  translateHorizontalAlign,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators/text/properties';

import { TextNode as PenpotTextNode, TextStyle } from '@ui/lib/types/shapes/textShape';

export const translateStyleTextSegments = (
  node: TextNode,
  segments: StyleTextSegment[]
): PenpotTextNode[] => {
  const partials = segments.map(segment => ({
    textNode: translateStyleTextSegment(node, segment),
    segment
  }));

  return translateParagraphProperties(node, partials);
};

export const transformTextStyle = (node: TextNode, segment: StyleTextSegment): TextStyle => {
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
    fills: translateFills(segment.fills),
    text: segment.characters,
    ...transformTextStyle(node, segment)
  };
};
