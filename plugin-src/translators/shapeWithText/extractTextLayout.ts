import {
  type Drawable,
  computePathBounds,
  extractDrawablePaths,
  parseDrawables
} from '@plugin/translators/shapeWithText/extractDrawables';

import type { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

export const extractTextLayoutFromDrawables = (
  textDrawables: Drawable[],
  aabb: { x: number; y: number; width: number; height: number },
  svgOrigin: { x: number; y: number } = { x: 0, y: 0 },
  rotation = 0
): Pick<ShapeGeomAttributes, 'x' | 'y' | 'width' | 'height'> | undefined => {
  if (textDrawables.length === 0) return;

  const subpaths = parseDrawables(textDrawables);
  const bounds = computePathBounds(subpaths);
  if (!bounds) return;

  const normalizedRot = ((rotation % 360) + 360) % 360;
  const isAxisAligned = [0, 90, 180, 270].some(angle => Math.abs(normalizedRot - angle) < 0.01);
  if (!isAxisAligned) return;
  const swapAxes = Math.abs(normalizedRot - 90) < 0.01 || Math.abs(normalizedRot - 270) < 0.01;

  const bbWidth = bounds.maxX - bounds.minX;
  const bbHeight = bounds.maxY - bounds.minY;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

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

export const extractTextLayout = (
  editableSvg: string,
  outlinedSvg: string,
  aabb: { x: number; y: number; width: number; height: number },
  svgOrigin: { x: number; y: number } = { x: 0, y: 0 },
  rotation = 0
): Pick<ShapeGeomAttributes, 'x' | 'y' | 'width' | 'height'> | undefined => {
  const shapeDrawables = extractDrawablePaths(editableSvg);
  const allDrawables = extractDrawablePaths(outlinedSvg);

  if (allDrawables.length <= shapeDrawables.length) return;

  return extractTextLayoutFromDrawables(
    allDrawables.slice(shapeDrawables.length),
    aabb,
    svgOrigin,
    rotation
  );
};
