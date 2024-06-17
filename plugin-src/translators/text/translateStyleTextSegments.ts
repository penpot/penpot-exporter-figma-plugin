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
    'font-family': segment.fontName.family,
    'font-size': segment.fontSize.toString(),
    'font-style': translateFontStyle(segment.fontName.style),
    'font-weight': segment.fontWeight.toString(),
    'text-align': translateHorizontalAlign(node.textAlignHorizontal),
    'text-decoration': translateTextDecoration(segment),
    'text-transform': translateTextTransform(segment),
    'letter-spacing': translateLetterSpacing(segment),
    'line-height': translateLineHeight(segment)
  };
};

const translateStyleTextSegment = (node: TextNode, segment: StyleTextSegment): PenpotTextNode => {
  return {
    fills: translateFills(segment.fills),
    text: segment.characters,
    ...transformTextStyle(node, segment)
  };
};
