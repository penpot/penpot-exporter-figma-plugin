import { textStyles } from '@plugin/libraries';
import { transformFills } from '@plugin/transformers/partials';
import { remapFigJamFontName, translateFontName } from '@plugin/translators/text/font';
import {
  type ParagraphMixin,
  type TextSegment,
  translateParagraphProperties
} from '@plugin/translators/text/paragraph';
import {
  translateFontStyle,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators/text/properties';
import { isFigJamEditor } from '@plugin/utils';

import type {
  TextNode as PenpotTextNode,
  TextHorizontalAlign,
  TextStyle
} from '@ui/lib/types/shapes/textShape';

export const translateTextSegments = (
  node: ParagraphMixin,
  segments: TextSegment[],
  textAlign: TextHorizontalAlign
): PenpotTextNode[] => {
  const partials = segments.map(segment => ({
    textNode: translateStyleTextSegment(segment, textAlign),
    segment
  }));

  return translateParagraphProperties(node, partials);
};

export const transformTextStyle = (
  segment: TextSegment,
  textAlign: TextHorizontalAlign
): TextStyle => {
  if (hasTextStyle(segment)) {
    return {
      ...partialTransformTextStyle(segment, textAlign),
      textStyleId: translateTextStyleId(segment.textStyleId)
    };
  }

  return {
    ...partialTransformTextStyle(segment, textAlign),
    fontFamily: remapFigJamFontName(segment.fontName)?.family ?? 'sourcesanspro',
    fontSize: segment.fontSize?.toString() ?? '14',
    fontStyle: translateFontStyle(segment),
    textDecoration: translateTextDecoration(segment),
    letterSpacing: translateLetterSpacing(segment),
    lineHeight: translateLineHeight(segment),
    textTransform: translateTextTransform(segment)
  };
};

const partialTransformTextStyle = (
  segment: TextSegment,
  textAlign: TextHorizontalAlign
): TextStyle => {
  return {
    ...translateFontName(segment.fontName),
    textAlign
  };
};

const translateStyleTextSegment = (
  segment: TextSegment,
  textAlign: TextHorizontalAlign
): PenpotTextNode => {
  return {
    text: segment.characters,
    ...transformTextStyle(segment, textAlign),
    ...transformFills(segment)
  };
};

const hasTextStyle = (segment: TextSegment): boolean => {
  // FigJam has no text styles API (`figma.getStyleByIdAsync` is missing),
  // so style references would crash during processAssets. Render inline.
  if (isFigJamEditor()) return false;

  return segment.textStyleId !== undefined && segment.textStyleId.length > 0;
};

const translateTextStyleId = (textStyleId: string | undefined): string | undefined => {
  if (textStyleId === undefined) return;

  if (!textStyles.has(textStyleId)) {
    textStyles.set(textStyleId, undefined);
  }

  return textStyleId;
};
