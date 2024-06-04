import { remoteComponentsLibrary } from '@plugin/RemoteComponentLibrary';
import {
  transformBlend,
  transformChildren,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
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
  baseY: number,
  remote: boolean = false
): Promise<FrameShape> => {
  if (node.type === 'COMPONENT_SET' && remote) {
    if (remoteComponentsLibrary.get(node.id)) {
      return remoteComponentsLibrary.get(node.id) as FrameShape;
    }
  }

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
      ...transformEffects(node)
    };
  }

  let frame = {
    type: 'frame',
    name: node.name,
    showContent: isSectionNode(node) ? true : !node.clipsContent,
    ...transformFigmaIds(node),
    ...(await transformFills(node)),
    ...frameSpecificAttributes,
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformSceneNode(node)
  } as FrameShape;

  if (node.type === 'COMPONENT_SET' && remote) {
    remoteComponentsLibrary.register(node.id, frame);
  }

  frame = {
    ...frame,
    ...(await transformChildren(node, baseX + node.x, baseY + node.y, remote))
  };

  remoteComponentsLibrary.register(node.id, frame);

  return frame;
};
