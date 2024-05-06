import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

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
  partials: PartialTranslation[]
): PenpotTextNode[] => {
  if (node.paragraphSpacing === 0 && node.paragraphIndent === 0)
    return unwrapPartialTranslations(partials);

  const splitSegments: PartialTranslation[] = [];

  partials.forEach(({ textNodes, segment }) => {
    splitSegments.push({
      textNodes: splitTextNodeByEOL(textNodes[0]),
      segment
    });
  });

  return addParagraphProperties(splitSegments, node.paragraphIndent, node.paragraphSpacing);
};

const unwrapPartialTranslations = (partials: PartialTranslation[]): PenpotTextNode[] => {
  return partials.reduce((acc: PenpotTextNode[], partial) => {
    return [...acc, ...partial.textNodes];
  }, []);
};

const splitTextNodeByEOL = (node: PenpotTextNode): PenpotTextNode[] => {
  const split = node.text.split(/(\n)/).filter(text => text !== '');

  return split.map(text => ({
    ...node,
    text: text
  }));
};

const addParagraphProperties = (
  partials: PartialTranslation[],
  indent: number,
  paragraphSpacing: number
): PenpotTextNode[] => {
  const result: PenpotTextNode[] = [];

  let lastIndentation = 0;

  partials.forEach(({ textNodes, segment }) =>
    textNodes.forEach(textNode => {
      const hasDifferentIndentation = segment.indentation !== lastIndentation;

      result.push(
        ...addParagraphPropertiesSingle(
          textNode,
          segment,
          indent,
          paragraphSpacing,
          hasDifferentIndentation
        )
      );

      lastIndentation = segment.indentation;
    })
  );

  return result;
};

const addParagraphPropertiesSingle = (
  node: PenpotTextNode,
  segment: StyleTextSegment,
  indent: number,
  paragraphSpacing: number,
  hasDifferentIndentation: boolean
): PenpotTextNode[] => {
  console.log(node, segment.indentation, segment.listOptions);

  const result: PenpotTextNode[] = [
    hasDifferentIndentation ? applyUnorderedList(node, segment.indentation) : node
  ];

  if (node.text !== '\n') return result;

  if (paragraphSpacing !== 0 && segment.indentation === 0) {
    result.push(segmentParagraphSpacing(paragraphSpacing));
  }

  if (indent !== 0 && segment.indentation === 0) {
    result.push(segmentIndent(indent));
  }

  return result;
};

const applyUnorderedList = (node: PenpotTextNode, indentation: number): PenpotTextNode => {
  return {
    ...node,
    text: `${'  '.repeat(indentation)} • ${node.text}`
  };
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
