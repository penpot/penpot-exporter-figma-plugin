import { type FillsLike, transformFills } from '@plugin/transformers/partials';
import { transformTextStyle, translateTextSegments } from '@plugin/translators/text';
import type { ParagraphMixin, TextSegment } from '@plugin/translators/text/paragraph';

import type {
  TextContent,
  TextHorizontalAlign,
  TextVerticalAlign
} from '@ui/lib/types/shapes/textShape';

export const buildTextContent = (
  node: ParagraphMixin & FillsLike,
  styledTextSegments: TextSegment[],
  textAlign: TextHorizontalAlign,
  verticalAlign: TextVerticalAlign
): TextContent => ({
  type: 'root',
  verticalAlign,
  children: styledTextSegments.length
    ? [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              children: translateTextSegments(node, styledTextSegments, textAlign),
              ...transformTextStyle(styledTextSegments[0], textAlign),
              ...transformFills(node)
            }
          ]
        }
      ]
    : undefined
});
