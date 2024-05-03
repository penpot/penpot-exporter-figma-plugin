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

import { TextNode as PenpotTextNode, TextStyle } from '@ui/lib/types/text/textContent';
import { TextShape } from '@ui/lib/types/text/textShape';

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
              children: transformStyleTextSegments(node, styledTextSegments),
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

const transformStyleTextSegments = (
  node: TextNode,
  segments: StyleTextSegment[]
): PenpotTextNode[] => {
  console.log(segments);
  const textNodes = segments.map(segment => {
    return transformStyleTextSegment(node, segment);
  });

  if (node.paragraphIndent === 0) return textNodes;

  const finalTextNodes: PenpotTextNode[] = [];
  textNodes.forEach(textNode => {
    const splitTextNode = splitTextNodeByEOL(textNode, node.paragraphIndent);
    finalTextNodes.push(...splitTextNode);
  });
  return finalTextNodes;
};

const splitTextNodeByEOL = (node: PenpotTextNode, indent: number): PenpotTextNode[] => {
  const splittedTextNodes: PenpotTextNode[] = [];
  const foo = node.text.split('\n');
  if (foo.length === 1) return [node];

  foo.forEach((text, index) => {
    splittedTextNodes.push(segmentIndent(indent));
    splittedTextNodes.push({
      ...node,
      text: text + (index === foo.length - 1 ? '' : '\n')
    });
  });

  return splittedTextNodes;
};

const needsSegmentIndent = (node: TextNode, segment: StyleTextSegment, index: number): boolean => {
  if (node.paragraphIndent === 0) return false;

  if (segment.characters.indexOf('\n') === -1) return false;

  return true;
};

const transformStyleTextSegment = (node: TextNode, segment: StyleTextSegment): PenpotTextNode => {
  return {
    fills: translateFills(segment.fills, node.width, node.height),
    text: segment.characters,
    ...transformTextStyle(node, segment)
  };
};

const segmentIndent = (indent: number): PenpotTextNode => {
  // space is 10px
  return {
    text: ' '.repeat(indent),
    fontId: 'sourcesanspro',
    fontVariantId: 'regular',
    fontSize: '4',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 1,
    letterSpacing: 0
  };
};

const transformTextStyle = (node: TextNode, segment: StyleTextSegment): Partial<TextStyle> => {
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
