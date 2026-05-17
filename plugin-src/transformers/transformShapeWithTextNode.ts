import { transformGroupNodeLike } from '@plugin/transformers';
import {
  transformBlend,
  transformDimension,
  transformFills,
  transformIds,
  transformRotationAndPosition,
  transformSceneNode,
  transformVectorIds
} from '@plugin/transformers/partials';
import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';
import { translateStrokes } from '@plugin/translators';
import {
  exportShapeWithTextSvg,
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
export const transformShapeWithTextNode = async (
  node: ShapeWithTextNode
): Promise<GroupShape | RectShape | undefined> => {
  const aabb = node.absoluteBoundingBox;
  if (!aabb) return await transformNodeAsImageRect(node);

  const svg = await exportShapeWithTextSvg(node);
  if (!svg) return await transformNodeAsImageRect(node);

  const content = translateShapeWithTextGeometry(node, svg, aabb);
  if (!content) return await transformNodeAsImageRect(node);

  const shape: PathShape = {
    type: 'path',
    name: node.name,
    content,
    ...transformVectorIds(node, 0),
    ...transformFills(node),
    strokes: translateStrokes(node),
    ...transformSceneNode(node)
  };

  // Spread order matters: transformDimension + transformRotationAndPosition set
  // the parent node's bounds and rotation, then extractTextLayout overrides
  // x/y/width/height with the actual <text> bounds from Figma's SVG so the
  // label sits inside the shape's interior instead of spanning the whole AABB.
  // When there's no <text> in the SVG, extractTextLayout returns undefined and
  // the spread is a no-op.
  const text: TextShape = {
    type: 'text',
    name: node.name,
    ...transformVectorIds(node, 1),
    ...translateShapeWithTextContent(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...extractTextLayout(svg, aabb),
    ...transformSceneNode(node)
  };

  return {
    ...transformIds(node),
    ...transformGroupNodeLike(node),
    ...transformBlend(node),
    children: [shape, text]
  };
};
