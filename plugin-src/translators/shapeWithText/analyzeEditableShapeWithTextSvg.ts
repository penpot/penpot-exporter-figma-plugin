import { buildPathContentFromDrawables } from '@plugin/translators/shapeWithText/buildPathContentFromDrawables';
import { extractDrawablePaths } from '@plugin/translators/shapeWithText/extractDrawables';
import { extractShadows } from '@plugin/translators/shapeWithText/extractShadows';
import { extractTextLines } from '@plugin/translators/shapeWithText/extractTextLines';

import type { Shadow } from '@ui/lib/types/utils/shadow';

export type EditableShapeWithTextAnalysis = {
  content: string;
  drawableCount: number;
  forcedLines: string[];
  shadow: Shadow[];
  svgOrigin: { x: number; y: number };
};

export const analyzeEditableShapeWithTextSvg = (
  node: ShapeWithTextNode,
  svg: string,
  aabb: Rect
): EditableShapeWithTextAnalysis | undefined => {
  const drawables = extractDrawablePaths(svg);
  if (drawables.length === 0) {
    console.warn('Skipping shape-with-text with no extractable path', {
      nodeId: node.id,
      nodeName: node.name,
      shapeType: node.shapeType
    });
    return;
  }

  const result = buildPathContentFromDrawables(drawables, aabb, () => {
    console.warn('Skipping shape-with-text subpath with invalid SVG', {
      nodeId: node.id,
      nodeName: node.name,
      shapeType: node.shapeType
    });
  });
  if (!result) return;

  return {
    content: result.content,
    drawableCount: drawables.length,
    forcedLines: extractTextLines(svg),
    shadow: extractShadows(svg),
    svgOrigin: { x: result.bounds.minX, y: result.bounds.minY }
  };
};
