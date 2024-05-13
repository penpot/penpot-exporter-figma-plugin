import { parseSVG } from 'svg-path-parser';

type BoundingBox = { x1: number; y1: number; x2: number; y2: number };

export const getBoundingBox = (vectorPath: VectorPath): BoundingBox => {
  const path = parseSVG(vectorPath.data);

  if (!path.length) return { x1: 0, y1: 0, x2: 0, y2: 0 };

  const bounds = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };

  for (const points of path) {
    switch (points.code) {
      case 'M':
      case 'L':
      case 'C':
        bounds.x1 = Math.min(bounds.x1, points.x);
        bounds.y1 = Math.min(bounds.y1, points.y);
        bounds.x2 = Math.max(bounds.x2, points.x);
        bounds.y2 = Math.max(bounds.y2, points.y);
    }
  }

  return bounds;
};
