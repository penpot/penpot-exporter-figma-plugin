import {
  transformAutoLayout,
  transformAutoLayoutPosition,
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutSizing,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { FrameShape } from '@ui/lib/types/shapes/frameShape';

const isSectionNode = (node: FrameNode | SectionNode | ComponentSetNode): node is SectionNode => {
  return node.type === 'SECTION';
};

export const transformFrameNode = async (
  node: FrameNode | SectionNode | ComponentSetNode,
  baseX: number,
  baseY: number
): Promise<FrameShape> => {
  let frameSpecificAttributes: Partial<FrameShape> = {};
  let reverseChildrenOrder = false;

  if (!isSectionNode(node)) {
    if (node.layoutMode !== 'NONE') {
      reverseChildrenOrder = true;
    }
    // Figma API does not expose strokes, blend modes, corner radius, or constraint proportions for sections,
    // they plan to add it in the future. Refactor this when available.
    frameSpecificAttributes = {
      // @see: https://forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658
      ...transformStrokes(node),
      // @see: https://forum.figma.com/t/add-a-blendmode-property-for-sectionnode/58560
      ...transformBlend(node),
      ...transformProportion(node),
      ...transformLayoutSizing(node),
      ...transformAutoLayoutPosition(node),
      ...transformCornerRadius(node),
      ...transformEffects(node),
      ...transformConstraints(node),
      ...transformAutoLayout(node)
    };
  }

  return {
    type: 'frame',
    name: node.name,
    showContent: isSectionNode(node) ? true : !node.clipsContent,
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...frameSpecificAttributes,
    ...(await transformChildren(node, baseX + node.x, baseY + node.y, reverseChildrenOrder)),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node)
  };
};
