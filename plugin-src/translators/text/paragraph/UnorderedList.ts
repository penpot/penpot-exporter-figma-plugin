import { List } from '@plugin/translators/text/paragraph/List';

import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { StyleTextSegment } from './translateParagraphProperties';

export class UnorderedList implements List {
  protected styles: Map<number, PenpotTextNode> = new Map();
  protected indentation = 0;

  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    this.updateStyles(textNode, segment);
    this.indentation = segment.indentation;

    return this.currentStyle(textNode, segment);
  }

  public restart(): void {
    this.styles = new Map();
    this.indentation = 0;
  }

  protected updateStyles(textNode: PenpotTextNode, segment: StyleTextSegment): void {
    if (segment.indentation > this.indentation) {
      this.styles.set(segment.indentation, this.createStyle(textNode, segment.indentation));
    } else if (segment.indentation < this.indentation) {
      for (let i = segment.indentation + 1; i <= this.indentation; i++) {
        this.styles.delete(i);
      }
    }
  }

  protected currentStyle(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    return this.styles.get(segment.indentation) ?? this.createStyle(textNode, segment.indentation);
  }

  protected createStyle(
    node: PenpotTextNode,
    indentation: number,
    character: string = ' •  '
  ): PenpotTextNode {
    return {
      ...node,
      text: `${'\t'.repeat(Math.max(0, indentation - 1))}${character}`
    };
  }
}
