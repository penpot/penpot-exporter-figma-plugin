import {
  transformBlend,
  transformChildren,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformFills,
  transformProportion,
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
    showContent: isSectionNode(node) ? true : !node.clipsContent,
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
    ...transformSceneNode(node),
    // Figma API does not expose constraints proportions for sections
    ...(isSectionNode(node) ? [] : transformProportion(node)),
    // Figma API does not expose corner radius for sections
    ...(isSectionNode(node) ? [] : transformCornerRadius(node))
  };
};
