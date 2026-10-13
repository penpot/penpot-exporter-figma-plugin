import { parseSVG } from 'svg-path-parser';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

/**
 * Figma keeps each disjoint area of a flattened vector as its own region, so a flattened icon
 * becomes several paths. When they are filled the same way they can be a single path: with the
 * nonzero fill rule, regions whose outlines are drawn in the same direction fill their union, like
 * the regions do, and the holes inside them, drawn the other way, stay empty.
 */
export const mergePathShapes = (paths: PathShape[]): PathShape | undefined => {
  const [first] = paths;

  if (first.svgAttrs?.fillRule !== 'nonzero' || first.strokes?.length) return;

  const style = getStyle(first);
  if (paths.some(path => getStyle(path) !== style)) return;

  const direction = getDirection(first.content);
  if (direction === 0 || paths.some(path => getDirection(path.content) !== direction)) return;

  return { ...first, content: paths.map(path => path.content).join(' ') };
};

const getStyle = (path: PathShape): string =>
  JSON.stringify({ ...path, id: undefined, shapeRef: undefined, content: undefined });

// Sign of the area enclosed by the outermost subpath (the one enclosing the largest area), or 0
// when the path has no area. Holes are drawn the other way, so this is the direction of the fill.
const getDirection = (content: string): number => {
  const subpaths: [number, number][][] = [];
  let current: [number, number][] = [];

  parseSVG(content).forEach(command => {
    switch (command.command) {
      case 'moveto':
        current = [[command.x, command.y]];
        subpaths.push(current);
        break;
      case 'lineto':
        current.push([command.x, command.y]);
        break;
      case 'curveto':
        current.push([command.x1, command.y1], [command.x2, command.y2], [command.x, command.y]);
        break;
    }
  });

  const outermost = subpaths
    .map(getSignedArea)
    .reduce((largest, area) => (Math.abs(area) > Math.abs(largest) ? area : largest), 0);

  return Math.sign(outermost);
};

const getSignedArea = (points: [number, number][]): number => {
  let area = 0;
  points.forEach(([x1, y1], index) => {
    const [x2, y2] = points[(index + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  });

  return area;
};
