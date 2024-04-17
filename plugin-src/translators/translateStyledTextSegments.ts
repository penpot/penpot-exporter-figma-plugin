import { transformTextStyle } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators/translateFills';

import { TextNode } from '@ui/lib/types/text/textContent';

export const translateStyledTextSegments = (
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
  >[],
  width: number,
  height: number
): TextNode[] => {
  return segments.map(segment => {
    figma.ui.postMessage({ type: 'FONT_NAME', data: segment.fontName.family });

    return {
      fills: translateFills(segment.fills, width, height),
      text: segment.characters,
      ...transformTextStyle(segment)
    };
  });
};
