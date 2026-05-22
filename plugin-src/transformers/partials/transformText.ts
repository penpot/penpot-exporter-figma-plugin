import { STYLED_TEXT_SEGMENT_FIELDS, buildTextContent } from '@plugin/translators/text';
import {
  translateGrowType,
  translateHorizontalAlign,
  translateVerticalAlign
} from '@plugin/translators/text/properties';

import type { TextAttributes, TextShape } from '@ui/lib/types/shapes/textShape';

export const transformText = (node: TextNode): TextAttributes & Pick<TextShape, 'growType'> => {
  const styledTextSegments = node.getStyledTextSegments(STYLED_TEXT_SEGMENT_FIELDS);

  return {
    characters: node.characters,
    content: buildTextContent(
      node,
      styledTextSegments,
      translateHorizontalAlign(node.textAlignHorizontal),
      translateVerticalAlign(node.textAlignVertical)
    ),
    growType: translateGrowType(node)
  };
};
