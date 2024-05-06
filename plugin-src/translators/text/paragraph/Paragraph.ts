import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { UnorderedList } from './UnorderedList';
import { StyleTextSegment } from './translateParagraphProperties';

export class Paragraph {
  private isParagraphStarting = true;
  private isPreviousNodeAList = false;
  private unorderedList = new UnorderedList();
  private firstSegment: StyleTextSegment | null = null;

  public format(
    node: TextNode,
    textNode: PenpotTextNode,
    segment: StyleTextSegment
  ): PenpotTextNode[] {
    const textNodes: PenpotTextNode[] = [];

    if (this.isParagraphStarting) {
      const isList = segment.listOptions.type !== 'NONE';

      if (!this.isFirstSegment(segment)) {
        const paragraphSpaceSegment = this.segmentParagraphSpacing(
          this.isPreviousNodeAList && isList ? node.listSpacing : node.paragraphSpacing
        );

        if (paragraphSpaceSegment) textNodes.push(paragraphSpaceSegment);
      }

      textNodes.push(
        isList
          ? this.unorderedList.getCurrentList(textNode, segment)
          : this.segmentIndent(node.paragraphIndent)
      );
    }

    textNodes.push(textNode);

    this.isPreviousNodeAList = segment.listOptions.type !== 'NONE';
    this.isParagraphStarting = textNode.text === '\n';

    return textNodes;
  }

  private isFirstSegment(segment: StyleTextSegment) {
    if (this.firstSegment === null) {
      this.firstSegment = segment;

      return true;
    }

    return this.firstSegment === segment;
  }

  private segmentIndent(indent: number): PenpotTextNode {
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
  }

  private segmentParagraphSpacing(paragraphSpacing: number): PenpotTextNode | undefined {
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
  }
}
