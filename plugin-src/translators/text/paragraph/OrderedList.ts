import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { List } from './List';
import { StyleTextSegment } from './translateParagraphProperties';

export class OrderedList implements List {
  private styles: PenpotTextNode[] = [];
  private indentation = 0;

  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    this.updateStyles(textNode, segment);

    return this.updateCurrentSymbol('*');
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
      text: `${'     '.repeat(Math.max(0, indentation - 1))}  {currentSymbol}.  `
    };
  }

  private updateCurrentSymbol(character: string): PenpotTextNode {
    const currentList = this.styles[this.styles.length - 1];

    return {
      ...currentList,
      text: currentList.text.replace('{currentSymbol}', character)
    };
  }
}
