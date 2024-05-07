import { StyleTextSegment } from '@plugin/translators/text/paragraph/translateParagraphProperties';

import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

export class BaseList {
  protected styles: Map<number, PenpotTextNode> = new Map();
  protected indentation = 0;

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
