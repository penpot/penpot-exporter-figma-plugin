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
  type ShapeWithTextGeometry,
  extractShadows,
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
// templates per shapeType) and a TextShape for the editable label. The text
// child is omitted when the node has no characters — Penpot auto-deletes empty
// text on blur, so emitting an empty scaffold disappears on first edit.
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
    return rasterFallback(node);
  }

  const svg = await exportSvg(node);
  if (!svg) return rasterFallback(node);

  const geometry = translateShapeWithTextGeometry(node, svg, aabb);
  if (!geometry) return rasterFallback(node);

  const children: (PathShape | TextShape)[] = [buildPathChild(node, svg, geometry)];
  if (node.text.characters.length > 0) {
    children.push(buildTextChild(node, svg, aabb, geometry.svgOrigin));
  }

  return {
    ...transformIds(node),
    ...transformGroupNodeLike(node),
    ...transformBlend(node),
    ...transformVariableConsumptionMap(node),
    ...transformOverrides(node),
    children
  };
};

const buildPathChild = (
  node: ShapeWithTextNode,
  svg: string,
  geometry: ShapeWithTextGeometry
): PathShape => {
  // Shadow / blur are absent from the Figma plugin API on ShapeWithTextNode
  // (typed as MinimalBlendMixin with no `effects`), so recover them by parsing
  // the SVG's <filter> definitions. Without this, white-filled rounded shapes
  // disappear into the canvas in Penpot.
  const shadow = extractShadows(svg);

  return {
    type: 'path',
    name: node.name,
    content: geometry.content,
    ...transformChildIds(node, 0),
    ...transformFills(node),
    strokes: translateStrokes(node),
    ...(shadow.length > 0 ? { shadow } : {}),
    ...transformSceneNode(node)
  };
};

// Spread order matters: transformDimension + transformRotationAndPosition set
// the text node's bounds and rotation from the parent's AABB, then
// extractTextLayout overrides x/y/width/height with the actual <text> bounds
// from Figma's SVG so the label sits inside the shape's interior instead of
// spanning the whole AABB.
const buildTextChild = (
  node: ShapeWithTextNode,
  svg: string,
  aabb: Rect,
  svgOrigin: { x: number; y: number }
): TextShape => ({
  type: 'text',
  name: node.text.characters,
  ...transformChildIds(node, 1),
  ...translateShapeWithTextContent(node),
  ...transformDimension(node),
  ...transformRotationAndPosition(node),
  ...extractTextLayout(svg, aabb, svgOrigin),
  ...transformSceneNode(node)
});

const rasterFallback = (node: ShapeWithTextNode): Promise<RectShape | undefined> =>
  transformNodeAsImageRect(node);

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
