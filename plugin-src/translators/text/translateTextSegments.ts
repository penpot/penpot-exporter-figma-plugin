import { textLibrary } from '@plugin/libraries';
import { transformFills } from '@plugin/transformers/partials';
import { translateFontName } from '@plugin/translators/text/font';
import { TextSegment, translateParagraphProperties } from '@plugin/translators/text/paragraph';
import {
  translateFontStyle,
  translateHorizontalAlign,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators/text/properties';

import { TextNode as PenpotTextNode, TextStyle } from '@ui/lib/types/shapes/textShape';

export const translateTextSegments = (
  node: TextNode,
  segments: TextSegment[]
): PenpotTextNode[] => {
  const partials = segments.map(segment => ({
    textNode: translateStyleTextSegment(node, segment),
    segment
  }));

  return translateParagraphProperties(node, partials);
};

export const transformTextStyle = (node: TextNode, segment: TextSegment): TextStyle => {
  if (hasTextStyle(segment)) {
    return {
      ...partialTransformTextStyle(node, segment),
      textStyleId: translateTextStyleId(segment.textStyleId)
    };
  }

  return {
    ...partialTransformTextStyle(node, segment),
    fontFamily: segment.fontName.family,
    fontSize: segment.fontSize.toString(),
    fontStyle: translateFontStyle(segment.fontName.style),
    textDecoration: translateTextDecoration(segment),
    letterSpacing: translateLetterSpacing(segment),
    lineHeight: translateLineHeight(segment),
    textTransform: translateTextTransform(segment)
  };
};

const partialTransformTextStyle = (node: TextNode, segment: TextSegment): TextStyle => {
  return {
    ...translateFontName(segment.fontName),
    textAlign: translateHorizontalAlign(node.textAlignHorizontal)
  };
};

const translateStyleTextSegment = (node: TextNode, segment: TextSegment): PenpotTextNode => {
  return {
    text: segment.characters,
    ...transformTextStyle(node, segment),
    ...transformFills(segment)
  };
};

const hasTextStyle = (segment: TextSegment): boolean => {
  return segment.textStyleId !== undefined && segment.textStyleId.length > 0;
};

const translateTextStyleId = (textStyleId: string | undefined): string | undefined => {
  if (textStyleId === undefined) return;

  if (!textLibrary.has(textStyleId)) {
    textLibrary.register(textStyleId);
  }

  return textStyleId;
};
