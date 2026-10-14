import { parseSVG } from 'svg-path-parser';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

/**
 * Figma keeps each disjoint area of a flattened vector as its own region, so a flattened icon
 * becomes several paths. When they are filled the same way they can be a single path: with the
 * nonzero fill rule, regions whose outlines are drawn in the same direction fill their union, like
 * the regions do, and the holes inside them, drawn the other way, stay empty.
 *
 * Regions drawn the other way are reversed first: with the nonzero fill rule, a path drawn
 * backwards fills exactly the same area.
 */
export const mergePathShapes = (paths: PathShape[]): PathShape | undefined => {
  const [first] = paths;

  if (first.svgAttrs?.fillRule !== 'nonzero' || first.strokes?.length) return;

  const style = getStyle(first);
  if (paths.some(path => getStyle(path) !== style)) return;

  const directions = paths.map(path => getDirection(path.content));
  if (directions.includes(0)) return;

  return {
    ...first,
    content: paths
      .map((path, index) =>
        directions[index] === directions[0] ? path.content : reverseContent(path.content)
      )
      .join(' ')
  };
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

type Point = { x: number; y: number };
type Segment = { to: Point; controls?: [Point, Point] };
type Subpath = { start: Point; segments: Segment[]; closed: boolean };

// Draws the same outline backwards: each subpath starts at its last point and goes through its
// segments in reverse order, with the control points of the curves swapped
const reverseContent = (content: string): string => {
  const subpaths: Subpath[] = [];
  let current: Subpath | undefined;

  // After a closepath, drawing without a moveto starts a new subpath at the same start point
  const getCurrent = (): Subpath => {
    if (!current || current.closed) {
      current = { start: current?.start ?? { x: 0, y: 0 }, segments: [], closed: false };
      subpaths.push(current);
    }

    return current;
  };

  parseSVG(content).forEach(command => {
    switch (command.command) {
      case 'moveto':
        current = { start: { x: command.x, y: command.y }, segments: [], closed: false };
        subpaths.push(current);
        break;
      case 'lineto':
        getCurrent().segments.push({ to: { x: command.x, y: command.y } });
        break;
      case 'curveto':
        getCurrent().segments.push({
          to: { x: command.x, y: command.y },
          controls: [
            { x: command.x1, y: command.y1 },
            { x: command.x2, y: command.y2 }
          ]
        });
        break;
      case 'closepath':
        getCurrent().closed = true;
        break;
    }
  });

  return subpaths.map(reverseSubpath).join(' ');
};

const reverseSubpath = ({ start, segments, closed }: Subpath): string => {
  const points = [start, ...segments.map(segment => segment.to)];
  const end = points[points.length - 1];

  const commands = [`M ${end.x} ${end.y}`];

  for (let index = segments.length - 1; index >= 0; index--) {
    const { controls } = segments[index];
    const to = points[index];

    commands.push(
      controls
        ? `C ${controls[1].x} ${controls[1].y}, ${controls[0].x} ${controls[0].y}, ${to.x} ${to.y}`
        : `L ${to.x} ${to.y}`
    );
  }

  if (closed) commands.push('Z');

  return commands.join(' ');
};
