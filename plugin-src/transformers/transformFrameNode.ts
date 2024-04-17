import {
  transformDimensionAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';
import { translateFills } from '@plugin/translators';

import { FrameShape } from '@ui/lib/types/frame/frameShape';

const isSectionNode = (node: FrameNode | SectionNode): node is SectionNode => {
  return node.type === 'SECTION';
};

export const transformFrameNode = async (
  node: FrameNode | SectionNode,
  baseX: number,
  baseY: number
): Promise<FrameShape> => {
  return {
    type: 'frame',
    name: node.name,
    fills: translateFills(node.fills, node.width, node.height),
    // Figma API does not expose strokes for sections,
    // they plan to add it in the future. Refactor this when available.
    // @see: https://forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658
    ...(isSectionNode(node) ? [] : transformStrokes(node)),
    ...(await transformChildren(node, baseX + node.x, baseY + node.y)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node)
  };
};
