import {
  computePathBounds,
  extractDrawablePaths,
  parseDrawables
} from '@plugin/translators/shapeWithText/extractDrawables';
import { serializeCommands } from '@plugin/translators/vectors';

export type ShapeWithTextGeometry = {
  content: string;
  svgOrigin: { x: number; y: number };
};

export const translateShapeWithTextGeometry = (
  node: ShapeWithTextNode,
  svg: string,
  aabb: Rect
): ShapeWithTextGeometry | undefined => {
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

  // SVG viewBox includes effects extents (shadow/blur), so SVG (0,0) ≠ aabb
  // top-left. Align geometry bbox top-left to aabb instead.
  const toCanvas: Transform = [
    [1, 0, aabb.x - bounds.minX],
    [0, 1, aabb.y - bounds.minY]
  ];

  const content = subpaths
    .map(commands => serializeCommands(commands, toCanvas))
    .join(' ')
    .trim();

  if (!content) return;

  return { content, svgOrigin: { x: bounds.minX, y: bounds.minY } };
};
