import {
  computePathBounds,
  extractDrawablePaths,
  parseDrawables
} from '@plugin/translators/shapeWithText/extractDrawables';

import type { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

// Derives the Penpot text shape's x/y/width/height from Figma's outlined SVG
// export. Figma renders the label's glyphs into a single <path> element placed
// after the shape's geometry drawables — counting the drawables in the
// editable (text-preserving) export tells us where the shape drawables end and
// the outlined text begins. The bbox of those text-only paths is the exact
// rendered text region for any font/script/size, replacing the previous
// char-width heuristic that only matched Inter Bold.
export const extractTextLayout = (
  editableSvg: string,
  outlinedSvg: string,
  aabb: { x: number; y: number },
  svgOrigin: { x: number; y: number } = { x: 0, y: 0 }
): Pick<ShapeGeomAttributes, 'x' | 'y' | 'width' | 'height'> | undefined => {
  const shapeDrawables = extractDrawablePaths(editableSvg);
  const allDrawables = extractDrawablePaths(outlinedSvg);

  // Outlined export must contain at least every shape drawable plus the text
  // path(s). If counts diverge below that (e.g. Figma changed export format),
  // we have no reliable way to separate shape from text — bail.
  if (allDrawables.length <= shapeDrawables.length) return;

  const textDrawables = allDrawables.slice(shapeDrawables.length);
  const subpaths = parseDrawables(textDrawables);
  const bounds = computePathBounds(subpaths);
  if (!bounds) return;

  return {
    x: aabb.x + (bounds.minX - svgOrigin.x),
    y: aabb.y + (bounds.minY - svgOrigin.y),
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY
  };
};
