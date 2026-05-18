import { transformFills } from '@plugin/transformers/partials';
import { transformTextStyle, translateTextSegments } from '@plugin/translators/text';
import type { TextSegment } from '@plugin/translators/text/paragraph';

import type {
  TextContent,
  TextHorizontalAlign,
  TextVerticalAlign
} from '@ui/lib/types/shapes/textShape';

// Shared root → paragraph-set → paragraph wrapper for Penpot text content. Used
// by transformText (TextNode) and translateShapeWithTextContent (TextSublayerNode).
// Each caller is responsible for fetching its own styled segments and deciding
// the alignment values.
export const buildTextContent = (
  node: NonResizableTextMixin & MinimalFillsMixin,
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
