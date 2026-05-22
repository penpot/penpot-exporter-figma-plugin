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
  type EditableShapeWithTextAnalysis,
  analyzeEditableShapeWithTextSvg,
  extractDrawablePaths,
  extractTextLayoutFromDrawables,
  translateShapeWithTextContent
} from '@plugin/translators/shapeWithText';
import { getRotation } from '@plugin/utils';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformShapeWithTextNode = async (
  node: ShapeWithTextNode
): Promise<GroupShape | RectShape | undefined> => {
  const aabb = node.absoluteBoundingBox;
  if (!aabb) return;

  const editableSvg = await exportSvg(node, false);
  if (!editableSvg) return rasterFallback(node);

  const editableAnalysis = analyzeEditableShapeWithTextSvg(node, editableSvg, aabb);
  if (!editableAnalysis) return rasterFallback(node);

  const children: (PathShape | TextShape)[] = [buildPathChild(node, editableAnalysis)];

  if (node.text.characters.length > 0) {
    const outlinedSvg = await exportSvg(node, true);
    if (outlinedSvg) {
      const textChild = buildTextChild(node, outlinedSvg, aabb, editableAnalysis);
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
  analysis: EditableShapeWithTextAnalysis
): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: analysis.content,
    ...transformChildIds(node, 0),
    ...transformFills(node),
    strokes: translateStrokes(node),
    ...(analysis.shadow.length > 0 ? { shadow: analysis.shadow } : {}),
    ...transformSceneNode(node)
  };
};

const buildTextChild = (
  node: ShapeWithTextNode,
  outlinedSvg: string,
  aabb: Rect,
  editableAnalysis: EditableShapeWithTextAnalysis
): TextShape | undefined => {
  const rotation = getRotation(node.absoluteTransform);
  const outlinedDrawables = extractDrawablePaths(outlinedSvg);
  const layout = extractTextLayoutFromDrawables(
    outlinedDrawables.slice(editableAnalysis.drawableCount),
    aabb,
    editableAnalysis.svgOrigin,
    rotation
  );

  if (!rotation && !layout) return;

  return {
    type: 'text',
    name: node.text.characters,
    ...transformChildIds(node, 1),
    ...translateShapeWithTextContent(node, editableAnalysis.forcedLines),
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
