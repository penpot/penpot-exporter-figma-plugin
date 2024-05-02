import { transformFills } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';
import {
  translateFontId,
  translateFontStyle,
  translateGrowType,
  translateHorizontalAlign,
  translateLetterSpacing,
  translateLineHeight,
  translateParagraphIndent,
  translateParagraphSpacing,
  translateTextDecoration,
  translateTextTransform,
  translateVerticalAlign
} from '@plugin/translators/text';

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
              children: styledTextSegments.map((segment, index) => ({
                fills: translateFills(segment.fills, node.width, node.height),
                text: translateParagraphSpacing(
                  node,
                  translateParagraphIndent(
                    node,
                    segment.characters,
                    segment.fontSize,
                    translateLetterSpacing(segment),
                    index
                  ),
                  segment.fontSize,
                  translateLineHeight(segment) ?? 1.2 // Approximation for line height
                ),
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
