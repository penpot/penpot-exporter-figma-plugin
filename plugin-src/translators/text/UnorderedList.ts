import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { StyleTextSegment } from './translateParagraphProperties';

export class UnorderedList {
  private styles: PenpotTextNode[] = [];
  private indentation = 0;

  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    this.updateStyles(textNode, segment);

    return this.styles[this.styles.length - 1];
  }

  private updateStyles(textNode: PenpotTextNode, segment: StyleTextSegment): void {
    if (segment.indentation > this.indentation) {
      this.styles.push(this.createStyle(textNode, segment.indentation));
    } else if (segment.indentation < this.indentation) {
      const elementsToRemove = this.indentation - segment.indentation;

      this.styles.splice(this.styles.length - elementsToRemove, elementsToRemove);
    }

    this.indentation = segment.indentation;
  }

  private createStyle(node: PenpotTextNode, indentation: number): PenpotTextNode {
    return {
      ...node,
      text: `${'     '.repeat(Math.max(0, indentation - 1))}  •  `
    };
  }
}
