import { textLibrary } from '@plugin/TextLibrary';
import { transformFills } from '@plugin/transformers/partials';
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
    lineHeight: translateLineHeight(segment)
  };
};

export const partialTransformTextStyle = (node: TextNode, segment: StyleTextSegment): TextStyle => {
  return {
    ...translateFontId(segment.fontName, segment.fontWeight),
    fontWeight: segment.fontWeight.toString(),
    textAlign: translateHorizontalAlign(node.textAlignHorizontal),
    textTransform: translateTextTransform(segment)
  };
};

const translateStyleTextSegment = (node: TextNode, segment: StyleTextSegment): PenpotTextNode => {
  return {
    text: segment.characters,
    ...transformTextStyle(node, segment),
    ...transformFills(segment)
  };
};

const hasTextStyle = (segment: StyleTextSegment): boolean => {
  return segment.textStyleId !== undefined && segment.textStyleId.length > 0;
};

const translateTextStyleId = (textStyleId: string | undefined): string | undefined => {
  if (textStyleId === undefined) return;

  if (!textLibrary.has(textStyleId)) {
    textLibrary.register(textStyleId);
  }

  return textStyleId;
};
