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
  aabb: { x: number; y: number; width: number; height: number },
  svgOrigin: { x: number; y: number } = { x: 0, y: 0 },
  rotation = 0
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

  // Figma's outlined SVG renders glyphs in canvas-space (rotation already
  // applied), so `bounds` is the canvas-space AABB of the rendered text. For
  // an axis-aligned rotation (0/90/180/270) the pre-rotation selrect that
  // Penpot stores can be derived by mapping the canvas AABB into the text's
  // local orientation around its center. For other rotations the canvas AABB
  // is larger than the true local rect — bail and let the caller fall back
  // to the node's AABB.
  const normalizedRot = ((rotation % 360) + 360) % 360;
  const isAxisAligned = [0, 90, 180, 270].some(angle => Math.abs(normalizedRot - angle) < 0.01);
  if (!isAxisAligned) return;
  const swapAxes = Math.abs(normalizedRot - 90) < 0.01 || Math.abs(normalizedRot - 270) < 0.01;

  const bbWidth = bounds.maxX - bounds.minX;
  const bbHeight = bounds.maxY - bounds.minY;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  // Pad is applied along the text's reading axis (local x) to absorb Penpot
  // font-metric drift — Penpot renders the same string slightly wider than
  // Figma, and without slack a forced line would overflow and re-wrap. In
  // canvas space the reading axis is whichever axis aligns with local x after
  // rotation: canvas x for 0/180, canvas y for 90/270.
  const readingSpan = swapAxes ? bbHeight : bbWidth;
  const pad = Math.max(readingSpan * 0.2, 8);

  const localW = readingSpan + pad;
  const localH = swapAxes ? bbWidth : bbHeight;

  const canvasCenterX = aabb.x + (centerX - svgOrigin.x);
  const canvasCenterY = aabb.y + (centerY - svgOrigin.y);

  return {
    x: canvasCenterX - localW / 2,
    y: canvasCenterY - localH / 2,
    width: localW,
    height: localH
  };
};
