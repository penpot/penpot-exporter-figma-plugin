import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { List } from './List';
import { StyleTextSegment } from './translateParagraphProperties';

export class Paragraph {
  private isParagraphStarting = false;
  private isPreviousNodeAList = false;
  private firstTextNode: PenpotTextNode | null = null;
  private list = new List();

  public format(
    node: TextNode,
    textNode: PenpotTextNode,
    segment: StyleTextSegment
  ): PenpotTextNode[] {
    const textNodes: PenpotTextNode[] = [];

    const spacing = this.applySpacing(segment, node);
    if (spacing) textNodes.push(spacing);

    const indentation = this.applyIndentation(textNode, segment, node);
    if (indentation) textNodes.push(indentation);

    textNodes.push(textNode);

    this.isPreviousNodeAList = segment.listOptions.type !== 'NONE';
    this.isParagraphStarting = textNode.text === '\n';

    return textNodes;
  }

  private applyIndentation(
    textNode: PenpotTextNode,
    segment: StyleTextSegment,
    node: TextNode
  ): PenpotTextNode | undefined {
    if (this.isParagraphStarting || this.isFirstTextNode(textNode)) {
      this.list.update(textNode, segment);

      return segment.listOptions.type !== 'NONE'
        ? this.list.getCurrentList(textNode, segment)
        : this.segmentIndent(node.paragraphIndent);
    }
  }

  private applySpacing(segment: StyleTextSegment, node: TextNode): PenpotTextNode | undefined {
    if (this.isParagraphStarting) {
      const isList = segment.listOptions.type !== 'NONE';

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

  private segmentIndent(indent: number): PenpotTextNode | undefined {
    if (indent === 0) return;

    return {
      'text': ' '.repeat(indent),
      'font-id': 'sourcesanspro',
      'font-variant-id': 'regular',
      'font-size': '5',
      'font-style': 'normal',
      'font-weight': '400',
      'line-height': 1,
      'letter-spacing': 0
    };
  }

  private segmentParagraphSpacing(paragraphSpacing: number): PenpotTextNode | undefined {
    if (paragraphSpacing === 0) return;

    return {
      'text': '\n',
      'font-id': 'sourcesanspro',
      'font-variant-id': 'regular',
      'font-size': paragraphSpacing.toString(),
      'font-style': 'normal',
      'font-weight': '400',
      'line-height': 1,
      'letter-spacing': 0
    };
  }
}
