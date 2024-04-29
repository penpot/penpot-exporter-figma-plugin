import { transformTextStyle } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators/translateFills';

import { TextNode as PenpotTextNode } from '@ui/lib/types/text/textContent';

export const translateStyledTextSegments = (
  node: TextNode,
  segments: Pick<
    StyledTextSegment,
    | 'characters'
    | 'start'
    | 'end'
    | 'fontName'
    | 'fontSize'
    | 'fontWeight'
    | 'lineHeight'
    | 'letterSpacing'
    | 'textCase'
    | 'textDecoration'
    | 'fills'
  >[]
): PenpotTextNode[] => {
  return segments.map(segment => {
    return {
      fills: translateFills(segment.fills, node.width, node.height),
      text: segment.characters,
      ...transformTextStyle(node, segment)
    };
  });
};
