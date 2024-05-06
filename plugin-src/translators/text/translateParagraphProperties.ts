import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { UnorderedList } from './UnorderedList';

export type StyleTextSegment = Pick<
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
>;

type PartialTranslation = {
  textNodes: PenpotTextNode[];
  segment: StyleTextSegment;
};

export const translateParagraphProperties = (
  node: TextNode,
  partials: { textNode: PenpotTextNode; segment: StyleTextSegment }[]
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
    text: text
  }));
};

const addParagraphProperties = (
  node: TextNode,
  partials: PartialTranslation[]
): PenpotTextNode[] => {
  const result: PenpotTextNode[] = [];
  const unorderedList = new UnorderedList();

  let isParagraphStarting = true;
  let isPreviousNodeAList = false;

  partials.forEach(({ textNodes, segment }, index) => {
    return textNodes.forEach(textNode => {
      if (isParagraphStarting) {
        const isList = segment.listOptions.type !== 'NONE';

        if (index !== 0) {
          const paragraphSpaceSegment = segmentParagraphSpacing(
            isPreviousNodeAList && isList ? node.listSpacing : node.paragraphSpacing
          );

          if (paragraphSpaceSegment) result.push(paragraphSpaceSegment);
        }

        if (isList) {
          result.push(unorderedList.getCurrentList(textNode, segment));
        } else {
          result.push(segmentIndent(node.paragraphIndent));
        }
      }

      result.push(textNode);

      isPreviousNodeAList = segment.listOptions.type !== 'NONE';
      isParagraphStarting = textNode.text === '\n';
    });
  });

  return result;
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

const segmentParagraphSpacing = (paragraphSpacing: number): PenpotTextNode | undefined => {
  if (paragraphSpacing === 0) return;

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
