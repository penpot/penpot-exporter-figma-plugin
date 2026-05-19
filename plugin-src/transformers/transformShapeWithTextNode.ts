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
  extractTextLines,
  translateShapeWithTextContent,
  translateShapeWithTextGeometry
} from '@plugin/translators/shapeWithText';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformShapeWithTextNode = async (
  node: ShapeWithTextNode
): Promise<GroupShape | RectShape | undefined> => {
  const aabb = node.absoluteBoundingBox;
  if (!aabb) {
    console.warn(`Shape-with-text "${node.name}" missing absoluteBoundingBox; rasterizing`);
    return rasterFallback(node);
  }

  const editableSvg = await exportSvg(node, false);
  if (!editableSvg) return rasterFallback(node);

  const geometry = translateShapeWithTextGeometry(node, editableSvg, aabb);
  if (!geometry) return rasterFallback(node);

  const children: (PathShape | TextShape)[] = [buildPathChild(node, editableSvg, geometry)];

  if (node.text.characters.length > 0) {
    const outlinedSvg = await exportSvg(node, true);
    if (outlinedSvg) {
      const textChild = buildTextChild(node, editableSvg, outlinedSvg, aabb, geometry.svgOrigin);
      if (textChild) children.push(textChild);
    }
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
  // MinimalBlendMixin exposes no `effects`; recover shadows from SVG <filter>.
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

// Spread order matters: `layout` must override the AABB-derived bounds last.
const buildTextChild = (
  node: ShapeWithTextNode,
  editableSvg: string,
  outlinedSvg: string,
  aabb: Rect,
  svgOrigin: { x: number; y: number }
): TextShape | undefined => {
  const rotation = node.rotation ?? 0;
  const layout = extractTextLayout(editableSvg, outlinedSvg, aabb, svgOrigin, rotation);

  if (!rotation && !layout) return;

  const forcedLines = extractTextLines(editableSvg);

  return {
    type: 'text',
    name: node.text.characters,
    ...transformChildIds(node, 1),
    ...translateShapeWithTextContent(node, forcedLines),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...(layout ?? {}),
    ...transformSceneNode(node)
  };
};

const rasterFallback = (node: ShapeWithTextNode): Promise<RectShape | undefined> =>
  transformNodeAsImageRect(node);

const exportSvg = async (
  node: ShapeWithTextNode,
  svgOutlineText: boolean
): Promise<string | undefined> => {
  try {
    return await node.exportAsync({
      format: 'SVG_STRING',
      svgOutlineText,
      svgIdAttribute: false
    });
  } catch (error) {
    console.warn(
      `Failed to export shape-with-text "${node.name}" as SVG (outline=${svgOutlineText})`,
      error
    );
    return;
  }
};
