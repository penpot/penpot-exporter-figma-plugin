import { TextNode as PenpotTextNode } from '@ui/lib/types/shapes/textShape';

import { StyleTextSegment } from './translateParagraphProperties';

export interface List {
  getCurrentList(textNode: PenpotTextNode, segment: StyleTextSegment): PenpotTextNode;
}
