import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { Paragraph } from './Paragraph';

export type TextSegment = Pick<
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
  | 'indentation'
  | 'listOptions'
  | 'fills'
  | 'fillStyleId'
  | 'textStyleId'
>;

type PartialTranslation = {
  textNodes: PenpotTextNode[];
  segment: TextSegment;
};

export const translateParagraphProperties = (
  node: TextNode,
  partials: { textNode: PenpotTextNode; segment: TextSegment }[]
): PenpotTextNode[] => {
  const splitSegments: PartialTranslation[] = [];

  partials.forEach(({ textNode, segment }) => {
    splitSegments.push({
      textNodes: splitTextNodeByEOL(textNode),
      segment
    });
  });

  return addParagraphProperties(node, splitSegments);
};

const splitTextNodeByEOL = (node: PenpotTextNode): PenpotTextNode[] => {
  const split = node.text.split(/(\n)/).filter(text => text !== '');

  return split.map(text => ({
    ...node,
    text: text.replace(/\u2028/g, '\n')
  }));
};

const addParagraphProperties = (
  node: TextNode,
  partials: PartialTranslation[]
): PenpotTextNode[] => {
  const formattedParagraphs: PenpotTextNode[] = [];
  const paragraph = new Paragraph();

  partials.forEach(({ textNodes, segment }) =>
    textNodes.forEach(textNode => {
      formattedParagraphs.push(...paragraph.format(node, textNode, segment));
    })
  );

  return formattedParagraphs;
};
