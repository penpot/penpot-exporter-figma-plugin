import { transformDimensionAndPosition } from '@plugin/transformers/partials';

import { PositionData } from '@ui/lib/types/text/textAttributes';
import { TextNode as PenpotTextNode } from '@ui/lib/types/text/textContent';

export const translateTextPositionData = (
  node: TextNode,
  segments: PenpotTextNode[],
  baseX: number,
  baseY: number
): PositionData[] => {
  return segments.map((segment): PositionData => {
    return {
      ...transformDimensionAndPosition(node, baseX, baseY),
      ...segment
    };
  });
};
