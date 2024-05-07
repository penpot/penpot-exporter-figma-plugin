import { BaseList } from '@plugin/translators/text/paragraph/BaseList';

import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { StyleTextSegment } from './translateParagraphProperties';

export class UnorderedList extends BaseList {
  public getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode {
    this.updateStyles(textNode, segment);
    this.indentation = segment.indentation;

    return this.currentStyle(textNode, segment);
  }

  public restart(): void {
    this.styles = new Map();
    this.indentation = 0;
  }
}
