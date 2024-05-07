import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { List } from './List';
import { OrderedList } from './OrderedList';
import { UnorderedList } from './UnorderedList';
import { StyleTextSegment } from './translateParagraphProperties';

export class Paragraph {
  private isParagraphStarting = false;
  private isPreviousNodeAList = false;
  private unorderedList = new UnorderedList();
  private orderedList = new OrderedList();
  private firstTextNode: PenpotTextNode | null = null;

  public format(
    node: TextNode,
    textNode: PenpotTextNode,
    segment: StyleTextSegment
  ): PenpotTextNode[] {
    const textNodes: PenpotTextNode[] = [];

    const spacing = this.applySpacing(textNode, segment, node);
    if (spacing) textNodes.push(spacing);

    const indentation = this.applyIndentation(textNode, segment, node);
    if (indentation) textNodes.push(indentation);

    textNodes.push(textNode);

    this.isPreviousNodeAList = segment.listOptions.type !== 'NONE';
    this.isParagraphStarting = textNode.text === '\n';

    if (!this.isPreviousNodeAList) {
      this.orderedList.restart();
      this.unorderedList.restart();
    }

    return textNodes;
  }

  private applyIndentation(
    textNode: PenpotTextNode,
    segment: StyleTextSegment,
    node: TextNode
  ): PenpotTextNode | undefined {
    if (this.isParagraphStarting || this.isFirstTextNode(textNode)) {
      const listType = this.getListType(segment.listOptions);
      const isList = listType !== undefined;

      return isList
        ? listType.getCurrentList(textNode, segment)
        : this.segmentIndent(node.paragraphIndent);
    }
  }

  private applySpacing(
    textNode: PenpotTextNode,
    segment: StyleTextSegment,
    node: TextNode
  ): PenpotTextNode | undefined {
    if (this.isParagraphStarting) {
      const listType = this.getListType(segment.listOptions);
      const isList = listType !== undefined;

      return this.segmentParagraphSpacing(
        this.isPreviousNodeAList && isList ? node.listSpacing : node.paragraphSpacing
      );
    }
  }

  private isFirstTextNode(textNode: PenpotTextNode) {
    if (this.firstTextNode === null) {
      this.firstTextNode = textNode;
      return true;
    }

    return false;
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

  private getListType(textListOptions: TextListOptions): List | undefined {
    switch (textListOptions.type) {
      case 'ORDERED':
        return this.orderedList;
      case 'UNORDERED':
        return this.unorderedList;
    }
  }
}
