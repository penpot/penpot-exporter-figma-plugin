import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

export const translateParagraphProperties = (
  node: TextNode,
  segments: PenpotTextNode[]
): PenpotTextNode[] => {
  if (node.paragraphSpacing === 0 && node.paragraphIndent === 0) return segments;

  const splitSegments: PenpotTextNode[] = [segmentIndent(node.paragraphIndent)];

  segments.forEach(segment => {
    splitSegments.push(...splitTextNodeByEOL(segment));
  });

  return addParagraphProperties(splitSegments, node.paragraphIndent, node.paragraphSpacing);
};

const splitTextNodeByEOL = (node: PenpotTextNode): PenpotTextNode[] => {
  const split = node.text.split(/(\n)/).filter(text => text !== '');

  return split.map(text => ({
    ...node,
    text: text
  }));
};

const addParagraphProperties = (
  nodes: PenpotTextNode[],
  indent: number,
  paragraphSpacing: number
): PenpotTextNode[] => {
  const indentedTextNodes: PenpotTextNode[] = [];

  nodes.forEach(node => {
    indentedTextNodes.push(node);

    if (node.text !== '\n') return;

    if (paragraphSpacing !== 0) {
      indentedTextNodes.push(segmentParagraphSpacing(paragraphSpacing));
    }

    if (indent !== 0) {
      indentedTextNodes.push(segmentIndent(indent));
    }
  });

  return indentedTextNodes;
};

const segmentIndent = (indent: number): PenpotTextNode => {
  return {
    text: ' '.repeat(indent),
    fontId: 'sourcesanspro',
    fontVariantId: 'regular',
    fontSize: '5',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 1,
    letterSpacing: 0
  };
};

const segmentParagraphSpacing = (paragraphSpacing: number): PenpotTextNode => {
  return {
    text: '\n',
    fontId: 'sourcesanspro',
    fontVariantId: 'regular',
    fontSize: paragraphSpacing.toString(),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 1,
    letterSpacing: 0
  };
};
