import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { List } from './List';
import { StyleTextSegment } from './translateParagraphProperties';

export class UnorderedList implements List {
  private styles: (PenpotTextNode | undefined)[] = [];
  private indentation = 0;

  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    this.updateStyles(textNode, segment);
    this.indentation = segment.indentation;

    return this.currentStyle(textNode, segment);
  }

  public restart(): void {
    this.styles = [];
    this.indentation = 0;
  }

  private updateStyles(textNode: PenpotTextNode, segment: StyleTextSegment): void {
    if (segment.indentation > this.indentation) {
      for (let i = 0; i < segment.indentation - this.indentation; i++) {
        this.styles.push(undefined);
      }
    } else if (segment.indentation < this.indentation) {
      const elementsToRemove = this.indentation - segment.indentation;
      this.styles.splice(this.styles.length - elementsToRemove, elementsToRemove);
    }

    if (this.styles[this.styles.length - 1] === undefined) {
      this.styles[this.styles.length - 1] = this.createStyle(textNode, segment.indentation);
    }
  }

  private currentStyle(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    return this.styles[this.styles.length - 1] ?? this.createStyle(textNode, segment.indentation);
  }

  private createStyle(node: PenpotTextNode, indentation: number): PenpotTextNode {
    return {
      ...node,
      text: `${'\t'.repeat(Math.max(0, indentation - 1))} •  `
    };
  }
}
