import {
  computePathBounds,
  extractDrawablePaths,
  parseDrawables
} from '@plugin/translators/shapeWithText/extractDrawables';
import { extractShadows } from '@plugin/translators/shapeWithText/extractShadows';
import { extractTextLines } from '@plugin/translators/shapeWithText/extractTextLines';
import { serializeCommands } from '@plugin/translators/vectors';

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

  const subpaths = parseDrawables(drawables, () => {
    console.warn('Skipping shape-with-text subpath with invalid SVG', {
      nodeId: node.id,
      nodeName: node.name,
      shapeType: node.shapeType
    });
  });
  const bounds = computePathBounds(subpaths);
  if (!bounds) return;

  const toCanvas: Transform = [
    [1, 0, aabb.x - bounds.minX],
    [0, 1, aabb.y - bounds.minY]
  ];
  const content = subpaths
    .map(commands => serializeCommands(commands, toCanvas))
    .join(' ')
    .trim();

  if (!content) return;

  return {
    content,
    drawableCount: drawables.length,
    forcedLines: extractTextLines(svg),
    shadow: extractShadows(svg),
    svgOrigin: { x: bounds.minX, y: bounds.minY }
  };
};
