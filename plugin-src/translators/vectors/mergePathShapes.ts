import { parseSVG } from 'svg-path-parser';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

/**
 * Figma keeps each disjoint area of a flattened vector as its own region, so a flattened icon
 * becomes several paths. When they are filled the same way they can be a single path: with the
 * nonzero fill rule, regions whose outlines are drawn in the same direction fill their union, like
 * the regions do, and the holes inside them, drawn the other way, stay empty.
 *
 * Regions drawn the other way are reversed first. If that merge is unavailable, regions without
 * crossing outlines can also be merged by orienting their nested subpaths for the nonzero rule.
 */
export const mergePathShapes = (paths: PathShape[]): PathShape | undefined => {
  return mergeNonzeroPaths(paths) ?? mergeNestedPaths(paths);
};

const mergeNonzeroPaths = (paths: PathShape[]): PathShape | undefined => {
  const [first] = paths;

  if (!first || first.svgAttrs?.fillRule !== 'nonzero' || first.strokes?.length) return;

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

const getStyleWithoutSvgAttrs = (path: PathShape): string =>
  JSON.stringify({
    ...path,
    id: undefined,
    shapeRef: undefined,
    content: undefined,
    svgAttrs: undefined
  });

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
type Polygon = Point[];

const mergeNestedPaths = (paths: PathShape[]): PathShape | undefined => {
  if (paths.length < 2 || paths.some(path => path.strokes?.length)) return;

  const [first] = paths;
  const style = getStyleWithoutSvgAttrs(first);
  if (paths.some(path => getStyleWithoutSvgAttrs(path) !== style)) return;

  const contents: string[] = [];
  for (const path of paths) {
    const subpaths = parseSubpaths(path.content);
    if (!subpaths?.length) return;

    const polygons = subpaths.map(flattenSubpath);
    if (polygons.reduce((count, polygon) => count + polygon.length, 0) > 2000) return;
    if (hasCrossings(polygons)) return;
    if (polygons.every(polygon => getPolygonArea(polygon) === 0)) return;

    subpaths.forEach((subpath, index) => {
      const polygon = polygons[index];
      const area = getPolygonArea(polygon);
      const depth = polygons.filter(
        (other, otherIndex) => otherIndex !== index && windingNumber(other, polygon[0]) !== 0
      ).length;
      contents.push(
        area !== 0 && Math.sign(area) !== (depth % 2 === 0 ? 1 : -1)
          ? reverseSubpath(subpath)
          : serializeSubpath(subpath)
      );
    });
  }

  return {
    ...first,
    svgAttrs: { ...first.svgAttrs, fillRule: 'nonzero' },
    content: contents.join(' ')
  };
};

const parseSubpaths = (content: string): Subpath[] | undefined => {
  const subpaths: Subpath[] = [];
  let current: Subpath | undefined;

  try {
    for (const command of parseSVG(content)) {
      switch (command.command) {
        case 'moveto':
          current = { start: { x: command.x, y: command.y }, segments: [], closed: false };
          subpaths.push(current);
          break;
        case 'lineto':
          if (!current) return;
          if (current.closed) {
            current = { start: current.start, segments: [], closed: false };
            subpaths.push(current);
          }
          current.segments.push({ to: { x: command.x, y: command.y } });
          break;
        case 'curveto':
          if (!current) return;
          if (current.closed) {
            current = { start: current.start, segments: [], closed: false };
            subpaths.push(current);
          }
          current.segments.push({
            to: { x: command.x, y: command.y },
            controls: [
              { x: command.x1, y: command.y1 },
              { x: command.x2, y: command.y2 }
            ]
          });
          break;
        case 'closepath':
          if (!current) return;
          current.closed = true;
          break;
        default:
          return;
      }
    }
  } catch {
    return;
  }

  return subpaths;
};

const flattenSubpath = ({ start, segments }: Subpath): Polygon => {
  const points = [start];
  let from = start;
  for (const { to, controls } of segments) {
    if (controls) {
      for (let step = 1; step <= 8; step++) {
        const t = step / 8;
        const u = 1 - t;
        points.push({
          x:
            u ** 3 * from.x +
            3 * u ** 2 * t * controls[0].x +
            3 * u * t ** 2 * controls[1].x +
            t ** 3 * to.x,
          y:
            u ** 3 * from.y +
            3 * u ** 2 * t * controls[0].y +
            3 * u * t ** 2 * controls[1].y +
            t ** 3 * to.y
        });
      }
    } else {
      points.push(to);
    }
    from = to;
  }
  if (
    points.length > 1 &&
    points[points.length - 1].x === start.x &&
    points[points.length - 1].y === start.y
  )
    points.pop();
  return points;
};

const getPolygonArea = (polygon: Polygon): number =>
  getSignedArea(polygon.map(({ x, y }) => [x, y]));

const cross = (a: Point, b: Point, c: Point): number =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

const hasCrossings = (polygons: Polygon[]): boolean => {
  const edges = polygons.flatMap((polygon, polygonIndex) =>
    polygon.map((from, edgeIndex) => ({
      from,
      to: polygon[(edgeIndex + 1) % polygon.length],
      polygonIndex,
      edgeIndex,
      edgeCount: polygon.length
    }))
  );

  for (let i = 0; i < edges.length; i++) {
    const a = edges[i];
    for (let j = i + 1; j < edges.length; j++) {
      const b = edges[j];
      if (
        a.polygonIndex === b.polygonIndex &&
        (Math.abs(a.edgeIndex - b.edgeIndex) === 1 ||
          Math.abs(a.edgeIndex - b.edgeIndex) === a.edgeCount - 1)
      )
        continue;
      if (
        Math.max(a.from.x, a.to.x) < Math.min(b.from.x, b.to.x) ||
        Math.max(b.from.x, b.to.x) < Math.min(a.from.x, a.to.x) ||
        Math.max(a.from.y, a.to.y) < Math.min(b.from.y, b.to.y) ||
        Math.max(b.from.y, b.to.y) < Math.min(a.from.y, a.to.y)
      )
        continue;
      const ab1 = cross(a.from, a.to, b.from);
      const ab2 = cross(a.from, a.to, b.to);
      const ba1 = cross(b.from, b.to, a.from);
      const ba2 = cross(b.from, b.to, a.to);
      if (ab1 * ab2 < 0 && ba1 * ba2 < 0) return true;
    }
  }
  return false;
};

const windingNumber = (polygon: Polygon, point: Point): number => {
  let winding = 0;
  polygon.forEach((from, index) => {
    const to = polygon[(index + 1) % polygon.length];
    if (from.y <= point.y && to.y > point.y && cross(from, to, point) > 0) winding++;
    if (from.y > point.y && to.y <= point.y && cross(from, to, point) < 0) winding--;
  });
  return winding;
};

const serializeSubpath = ({ start, segments, closed }: Subpath): string => {
  const commands = [`M ${start.x} ${start.y}`];
  segments.forEach(({ to, controls }) => {
    commands.push(
      controls
        ? `C ${controls[0].x} ${controls[0].y}, ${controls[1].x} ${controls[1].y}, ${to.x} ${to.y}`
        : `L ${to.x} ${to.y}`
    );
  });
  if (closed) commands.push('Z');
  return commands.join(' ');
};

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
