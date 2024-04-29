import { transformFills } from '@plugin/transformers/partials';
import {
  translateFills,
  translateFontId,
  translateFontStyle,
  translateFontVariantId,
  translateGrowType,
  translateHorizontalAlign,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform,
  translateVerticalAlign
} from '@plugin/translators';

import { TextStyle } from '@ui/lib/types/text/textContent';
import { TextShape } from '@ui/lib/types/text/textShape';

export const transformText = (node: TextNode): Partial<TextShape> => {
  const styledTextSegments = node.getStyledTextSegments([
    'fontName',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textCase',
    'textDecoration',
    'fills'
  ]);

  return {
    content: {
      type: 'root',
      verticalAlign: translateVerticalAlign(node.textAlignVertical),
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              children: styledTextSegments.map(segment => ({
                fills: translateFills(segment.fills, node.width, node.height),
                text: segment.characters,
                ...transformTextStyle(node, segment)
              })),
              ...(styledTextSegments.length ? transformTextStyle(node, styledTextSegments[0]) : {}),
              ...transformFills(node)
            }
          ]
        }
      ]
    },
    growType: translateGrowType(node)
  };
};

const transformTextStyle = (
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
    fontVariantId: translateFontVariantId(segment.fontName, segment.fontWeight),
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
