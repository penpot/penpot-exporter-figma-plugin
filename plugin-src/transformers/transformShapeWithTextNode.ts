import { transformGroupNodeLike } from '@plugin/transformers';
import {
  transformBlend,
  transformChildIds,
  transformDimension,
  transformFills,
  transformIds,
  transformOverrides,
  transformRotationAndPosition,
  transformSceneNode,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';
import { translateStrokes } from '@plugin/translators';
import {
  extractTextLayout,
  translateShapeWithTextContent,
  translateShapeWithTextGeometry
} from '@plugin/translators/shapeWithText';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

// Penpot has no native ShapeWithText equivalent, so emit a GroupShape wrapping
// a PathShape (geometry pulled from Figma's SVG export to avoid hardcoded
// templates per shapeType) and a TextShape for the editable label.
//
// Text alignment / vertical alignment / autoresize are hardcoded because
// TextSublayerNode does not expose them; Figma renders shape-with-text with
// center/center alignment and a fixed size matched to the shape.
export const transformShapeWithTextNode = async (
  node: ShapeWithTextNode
): Promise<GroupShape | RectShape | undefined> => {
  const aabb = node.absoluteBoundingBox;
  if (!aabb) {
    console.warn(`Shape-with-text "${node.name}" missing absoluteBoundingBox; rasterizing`);
    return await transformNodeAsImageRect(node);
  }

  const svg = await exportSvg(node);
  if (!svg) return await transformNodeAsImageRect(node);

  const content = translateShapeWithTextGeometry(node, svg, aabb);
  if (!content) return await transformNodeAsImageRect(node);

  const shape: PathShape = {
    type: 'path',
    name: node.name,
    content,
    ...transformChildIds(node, 0),
    ...transformFills(node),
    strokes: translateStrokes(node),
    ...transformSceneNode(node)
  };

  // No transformEffects: ShapeWithTextNode has MinimalBlendMixin (opacity +
  // blendMode) but not the full BlendMixin — Figma does not expose shadows or
  // blur on shape-with-text.
  return {
    ...transformIds(node),
    ...transformGroupNodeLike(node),
    ...transformBlend(node),
    ...transformVariableConsumptionMap(node),
    ...transformOverrides(node),
    children: node.text.characters.length > 0 ? [shape, buildTextChild(node, svg, aabb)] : [shape]
  };
};

// Spread order matters: transformDimension + transformRotationAndPosition set
// the parent node's bounds and rotation, then extractTextLayout overrides
// x/y/width/height with the actual <text> bounds from Figma's SVG so the label
// sits inside the shape's interior instead of spanning the whole AABB.
const buildTextChild = (node: ShapeWithTextNode, svg: string, aabb: Rect): TextShape => ({
  type: 'text',
  name: node.text.characters,
  ...transformChildIds(node, 1),
  ...translateShapeWithTextContent(node),
  ...transformDimension(node),
  ...transformRotationAndPosition(node),
  ...extractTextLayout(svg, aabb),
  ...transformSceneNode(node)
});

const exportSvg = async (node: ShapeWithTextNode): Promise<string | undefined> => {
  try {
    return await node.exportAsync({
      format: 'SVG_STRING',
      svgOutlineText: false,
      svgIdAttribute: false
    });
  } catch (error) {
    console.warn(`Failed to export shape-with-text "${node.name}" as SVG`, error);
    return;
  }
};
