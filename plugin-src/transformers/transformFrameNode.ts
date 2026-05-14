import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformGrids,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import { isFigJamEditor, rgbToHex } from '@plugin/utils';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { Point } from '@ui/lib/types/utils/point';
import type { Stroke } from '@ui/lib/types/utils/stroke';

// FigJam renders sections with a fixed visible corner radius and a 1px border
// derived from the section fill color. Neither is exposed via the Plugin API,
// so we approximate the UI.
const FIGJAM_SECTION_CORNER_RADIUS = 16;
const FIGJAM_SECTION_STROKE_DARKEN = 0.85;
const FIGJAM_SECTION_STROKE_WIDTH = 2;
const FIGJAM_SECTION_FALLBACK_STROKE = '#000000';
const FIGJAM_SECTION_FALLBACK_STROKE_OPACITY = 0.12;

const getSectionStroke = (node: SectionNode): Stroke => {
  const solidFill =
    node.fills !== figma.mixed
      ? (node.fills.find(
          (fill): fill is SolidPaint => fill.type === 'SOLID' && fill.visible !== false
        ) ?? undefined)
      : undefined;

  if (!solidFill) {
    return {
      strokeColor: FIGJAM_SECTION_FALLBACK_STROKE,
      strokeOpacity: FIGJAM_SECTION_FALLBACK_STROKE_OPACITY,
      strokeStyle: 'solid',
      strokeWidth: FIGJAM_SECTION_STROKE_WIDTH,
      strokeAlignment: 'inner'
    };
  }

  const darker = {
    r: solidFill.color.r * FIGJAM_SECTION_STROKE_DARKEN,
    g: solidFill.color.g * FIGJAM_SECTION_STROKE_DARKEN,
    b: solidFill.color.b * FIGJAM_SECTION_STROKE_DARKEN
  };

  return {
    strokeColor: rgbToHex(darker),
    strokeOpacity: solidFill.opacity ?? 1,
    strokeStyle: 'solid',
    strokeWidth: FIGJAM_SECTION_STROKE_WIDTH,
    strokeAlignment: 'inner'
  };
};

const isSectionNode = (
  node: FrameNode | SectionNode | SlotNode | ComponentSetNode
): node is SectionNode => {
  return node.type === 'SECTION';
};

export const transformFrameNode = async (
  node: FrameNode | SectionNode | SlotNode
): Promise<FrameShape> => {
  let frameSpecificAttributes: Partial<FrameShape> = {};
  let referencePoint: Point = { x: node.absoluteTransform[0][2], y: node.absoluteTransform[1][2] };

  if (!isSectionNode(node)) {
    const { x, y, ...transformAndRotation } = transformRotationAndPosition(node);

    referencePoint = { x, y };

    // Figma API does not expose strokes, blend modes, corner radius, or constraint proportions for sections,
    // they plan to add it in the future. Refactor this when available.
    frameSpecificAttributes = {
      // @see: https://forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658
      ...transformStrokes(node),
      // @see: https://forum.figma.com/t/add-a-blendmode-property-for-sectionnode/58560
      ...transformBlend(node),
      ...transformProportion(node),
      ...transformLayoutAttributes(node, true),
      ...transformCornerRadius(node),
      ...transformEffects(node),
      ...transformConstraints(node),
      ...transformAutoLayout(node),
      ...transformGrids(node),
      ...transformAndRotation
    };
  } else if (isFigJamEditor()) {
    frameSpecificAttributes = {
      r1: FIGJAM_SECTION_CORNER_RADIUS,
      r2: FIGJAM_SECTION_CORNER_RADIUS,
      r3: FIGJAM_SECTION_CORNER_RADIUS,
      r4: FIGJAM_SECTION_CORNER_RADIUS,
      strokes: [getSectionStroke(node)]
    };
  }

  return {
    type: 'frame',
    name: node.name,
    showContent: isSectionNode(node) ? true : !node.clipsContent,
    hideInViewer: !node.visible,
    ...transformIds(node),
    ...transformFills(node),
    ...referencePoint,
    ...frameSpecificAttributes,
    ...transformDimension(node),
    ...transformSceneNode(node),
    ...transformVariableConsumptionMap(node),
    ...(await transformChildren(node)),
    ...transformOverrides(node)
  };
};
