import { parseSVG } from 'svg-path-parser';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

/**
 * Figma keeps each disjoint area of a flattened vector as its own region, so a flattened icon
 * becomes several paths. When they are filled the same way they can be a single path: with the
 * nonzero fill rule, subpaths drawn in the same direction fill their union, like the regions do.
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

// Sign of the area enclosed by the path, or 0 when it has no area or more than one subpath
const getDirection = (content: string): number => {
  const commands = parseSVG(content);

  if (commands.filter(command => command.command === 'moveto').length !== 1) return 0;

  const points = commands.flatMap((command): [number, number][] => {
    switch (command.command) {
      case 'moveto':
      case 'lineto':
        return [[command.x, command.y]];
      case 'curveto':
        return [
          [command.x1, command.y1],
          [command.x2, command.y2],
          [command.x, command.y]
        ];
      default:
        return [];
    }
  });

  let area = 0;
  points.forEach(([x1, y1], index) => {
    const [x2, y2] = points[(index + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  });

  return Math.sign(area);
};
