import {
  transformBlend,
  transformChildren,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { FrameShape } from '@ui/lib/types/shapes/frameShape';

const isSectionNode = (node: FrameNode | SectionNode): node is SectionNode => {
  return node.type === 'SECTION';
};

export const transformFrameNode = async (
  node: FrameNode | SectionNode,
  baseX: number,
  baseY: number,
  baseRotation: number
): Promise<FrameShape> => {
  console.log(node);
  let frameSpecificAttributes: Partial<FrameShape> = {};

  if (!isSectionNode(node)) {
    // Figma API does not expose strokes, blend modes, corner radius, or constraint proportions for sections,
    // they plan to add it in the future. Refactor this when available.
    frameSpecificAttributes = {
      // @see: https://forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658
      ...(await transformStrokes(node)),
      // @see: https://forum.figma.com/t/add-a-blendmode-property-for-sectionnode/58560
      ...transformBlend(node),
      ...transformProportion(node),
      ...transformCornerRadius(node),
      ...transformEffects(node),
      ...transformRotationAndPosition(node, baseX, baseY, baseRotation)
    };
  }

  return {
    type: 'frame',
    name: node.name,
    showContent: isSectionNode(node) ? true : !node.clipsContent,
    x: node.x + baseX,
    y: node.y + baseY,
    ...(await transformFills(node)),
    ...frameSpecificAttributes,
    ...(await transformChildren(
      node,
      frameSpecificAttributes?.x ?? baseX + node.x,
      frameSpecificAttributes?.y ?? baseY + node.y,
      baseRotation + (!isSectionNode(node) ? node.rotation : 0)
    )),
    ...transformDimension(node),
    ...transformSceneNode(node)
  };
};
