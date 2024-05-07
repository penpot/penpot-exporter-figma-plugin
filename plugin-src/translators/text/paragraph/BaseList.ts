import { List } from '@plugin/translators/text/paragraph/List';
import { StyleTextSegment } from '@plugin/translators/text/paragraph/translateParagraphProperties';

import { TextNode as PenpotTextNode, TextNode } from '@ui/lib/types/shapes/textShape';

export abstract class BaseList implements List {
  protected styles: Map<number, PenpotTextNode> = new Map();
  protected indentation = 0;

  abstract getCurrentList(textNode: TextNode, segment: StyleTextSegment): TextNode;

  abstract restart(): void;

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
