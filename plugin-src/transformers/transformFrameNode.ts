import {
  transformBlend,
  transformChildren,
  transformDimensionAndPosition,
  transformFills,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

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
    ...transformFills(node),
    // Figma API does not expose strokes for sections,
    // they plan to add it in the future. Refactor this when available.
    // @see: https://forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658
    ...(isSectionNode(node) ? [] : transformStrokes(node)),
    ...(await transformChildren(node, baseX + node.x, baseY + node.y)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    // Figma API does not expose blend modes for sections,
    // they plan to add it in the future. Refactor this when available.
    // @see: https://forum.figma.com/t/add-a-blendmode-property-for-sectionnode/58560
    ...(isSectionNode(node) ? [] : transformBlend(node)),
    ...transformSceneNode(node)
  };
};
