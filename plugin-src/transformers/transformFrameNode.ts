import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Point } from '@ui/lib/types/utils/point';

const isSectionNode = (node: FrameNode | SectionNode | ComponentSetNode): node is SectionNode => {
  return node.type === 'SECTION';
};

export const transformFrameNode = async (
  node: FrameNode | SectionNode | ComponentSetNode,
  baseX: number,
  baseY: number,
  baseRotation: number
): Promise<FrameShape> => {
  let frameSpecificAttributes: Partial<FrameShape> = {};
  let referencePoint: Point = { x: node.x + baseX, y: node.y + baseY };
  let rotation = baseRotation;

  if (!isSectionNode(node)) {
    const { x, y, ...transformAndRotation } = transformRotationAndPosition(
      node,
      baseX,
      baseY,
      baseRotation
    );

    referencePoint = { x, y };
    rotation += node.rotation;

    // Figma API does not expose strokes, blend modes, corner radius, or constraint proportions for sections,
    // they plan to add it in the future. Refactor this when available.
    frameSpecificAttributes = {
      // @see: https://forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658
      ...transformStrokes(node),
      // @see: https://forum.figma.com/t/add-a-blendmode-property-for-sectionnode/58560
      ...transformBlend(node),
      ...transformProportion(node),
      ...transformLayoutAttributes(node),
      ...transformCornerRadius(node),
      ...transformEffects(node),
      ...transformConstraints(node),
      ...transformAutoLayout(node),
      ...transformAndRotation
    };
  }

  console.log(
    node.id,
    node.name,
    { x: node.x, y: node.y },
    { x: node.absoluteBoundingBox?.x, y: node.absoluteBoundingBox?.y },
    referencePoint
  );

  return {
    type: 'frame',
    name: node.name,
    showContent: isSectionNode(node) ? true : !node.clipsContent,
    ...referencePoint,
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...frameSpecificAttributes,
    ...transformDimension(node),
    ...(await transformChildren(node, referencePoint.x, referencePoint.y, rotation)),
    ...transformSceneNode(node)
  };
};
