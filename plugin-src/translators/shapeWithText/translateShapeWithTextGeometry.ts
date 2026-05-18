import {
  computePathBounds,
  extractDrawablePaths,
  parseDrawables
} from '@plugin/translators/shapeWithText/extractDrawables';
import { serializeCommands } from '@plugin/translators/vectors';

export type ShapeWithTextGeometry = {
  content: string;
  // SVG-local origin of the drawn geometry's bounding box. Subtracted from any
  // other SVG-local coordinate (e.g. text positions) to align with the aabb's
  // canvas origin, accounting for Figma's render-bounds-sized viewBox.
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

  // Figma's SVG viewBox includes the shape's render bounds (effects extents
  // like shadow/blur), so SVG-local (0,0) does NOT match aabb.(x,y). Align the
  // drawn geometry's bounding-box top-left to aabb.(x,y) instead — works
  // regardless of how much margin Figma added for effects.
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
