type Point = { x: number; y: number };
type Size = { width: number; height: number };

export type PathShapeType =
  | 'DIAMOND'
  | 'TRIANGLE_UP'
  | 'TRIANGLE_DOWN'
  | 'HEXAGON'
  | 'PENTAGON'
  | 'OCTAGON'
  | 'STAR'
  | 'PLUS'
  | 'ARROW_LEFT'
  | 'ARROW_RIGHT'
  | 'CHEVRON'
  | 'PARALLELOGRAM_LEFT'
  | 'PARALLELOGRAM_RIGHT'
  | 'TRAPEZOID'
  | 'INTERNAL_STORAGE';

export const PATH_SHAPE_TYPES: ReadonlySet<PathShapeType> = new Set<PathShapeType>([
  'DIAMOND',
  'TRIANGLE_UP',
  'TRIANGLE_DOWN',
  'HEXAGON',
  'PENTAGON',
  'OCTAGON',
  'STAR',
  'PLUS',
  'ARROW_LEFT',
  'ARROW_RIGHT',
  'CHEVRON',
  'PARALLELOGRAM_LEFT',
  'PARALLELOGRAM_RIGHT',
  'TRAPEZOID',
  'INTERNAL_STORAGE'
]);

export const isPathShapeType = (shapeType: string): shapeType is PathShapeType =>
  PATH_SHAPE_TYPES.has(shapeType as PathShapeType);

const formatPoint = (point: Point): string => `${point.x} ${point.y}`;

const closedPolygon = (points: Point[]): string => {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${formatPoint(first)} ${rest.map(p => `L ${formatPoint(p)}`).join(' ')} Z`;
};

const regularPolygon = (origin: Point, size: Size, sides: number, startAngle: number): Point[] => {
  const cx = origin.x + size.width / 2;
  const cy = origin.y + size.height / 2;
  const rx = size.width / 2;
  const ry = size.height / 2;
  const points: Point[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / sides;
    points.push({
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle)
    });
  }
  return points;
};

const diamond = (o: Point, s: Size): string =>
  closedPolygon([
    { x: o.x + s.width / 2, y: o.y },
    { x: o.x + s.width, y: o.y + s.height / 2 },
    { x: o.x + s.width / 2, y: o.y + s.height },
    { x: o.x, y: o.y + s.height / 2 }
  ]);

const triangleUp = (o: Point, s: Size): string =>
  closedPolygon([
    { x: o.x + s.width / 2, y: o.y },
    { x: o.x + s.width, y: o.y + s.height },
    { x: o.x, y: o.y + s.height }
  ]);

const triangleDown = (o: Point, s: Size): string =>
  closedPolygon([
    { x: o.x, y: o.y },
    { x: o.x + s.width, y: o.y },
    { x: o.x + s.width / 2, y: o.y + s.height }
  ]);

// Flat-top hexagon: vertices at top-left, top-right, right, bottom-right, bottom-left, left.
const hexagon = (o: Point, s: Size): string =>
  closedPolygon([
    { x: o.x + s.width * 0.25, y: o.y },
    { x: o.x + s.width * 0.75, y: o.y },
    { x: o.x + s.width, y: o.y + s.height / 2 },
    { x: o.x + s.width * 0.75, y: o.y + s.height },
    { x: o.x + s.width * 0.25, y: o.y + s.height },
    { x: o.x, y: o.y + s.height / 2 }
  ]);

// Pointy-top regular pentagon inscribed in the bounding box.
const pentagon = (o: Point, s: Size): string =>
  closedPolygon(regularPolygon(o, s, 5, -Math.PI / 2));

// Octagon with corners cut at ~22.5°. Cut size scales with the shortest side.
const octagon = (o: Point, s: Size): string => {
  const c = Math.min(s.width, s.height) * 0.293;
  return closedPolygon([
    { x: o.x + c, y: o.y },
    { x: o.x + s.width - c, y: o.y },
    { x: o.x + s.width, y: o.y + c },
    { x: o.x + s.width, y: o.y + s.height - c },
    { x: o.x + s.width - c, y: o.y + s.height },
    { x: o.x + c, y: o.y + s.height },
    { x: o.x, y: o.y + s.height - c },
    { x: o.x, y: o.y + c }
  ]);
};

// 5-pointed star: 10 vertices alternating outer/inner radius. Inner radius
// uses 0.382 of the outer (regular pentagram ratio).
const star = (o: Point, s: Size): string => {
  const cx = o.x + s.width / 2;
  const cy = o.y + s.height / 2;
  const outerRx = s.width / 2;
  const outerRy = s.height / 2;
  const innerRx = outerRx * 0.382;
  const innerRy = outerRy * 0.382;
  const points: Point[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const isOuter = i % 2 === 0;
    points.push({
      x: cx + (isOuter ? outerRx : innerRx) * Math.cos(angle),
      y: cy + (isOuter ? outerRy : innerRy) * Math.sin(angle)
    });
  }
  return closedPolygon(points);
};

// Plus sign: arm thickness = 1/3 of the shortest side.
const plus = (o: Point, s: Size): string => {
  const t = Math.min(s.width, s.height) / 3;
  const cx = o.x + s.width / 2;
  const cy = o.y + s.height / 2;
  return closedPolygon([
    { x: cx - t / 2, y: o.y },
    { x: cx + t / 2, y: o.y },
    { x: cx + t / 2, y: cy - t / 2 },
    { x: o.x + s.width, y: cy - t / 2 },
    { x: o.x + s.width, y: cy + t / 2 },
    { x: cx + t / 2, y: cy + t / 2 },
    { x: cx + t / 2, y: o.y + s.height },
    { x: cx - t / 2, y: o.y + s.height },
    { x: cx - t / 2, y: cy + t / 2 },
    { x: o.x, y: cy + t / 2 },
    { x: o.x, y: cy - t / 2 },
    { x: cx - t / 2, y: cy - t / 2 }
  ]);
};

// Rightward arrow: rectangular body + triangular head.
const arrowRight = (o: Point, s: Size): string => {
  const bodyEndX = o.x + s.width * 0.7;
  return closedPolygon([
    { x: o.x, y: o.y + s.height * 0.3 },
    { x: bodyEndX, y: o.y + s.height * 0.3 },
    { x: bodyEndX, y: o.y },
    { x: o.x + s.width, y: o.y + s.height / 2 },
    { x: bodyEndX, y: o.y + s.height },
    { x: bodyEndX, y: o.y + s.height * 0.7 },
    { x: o.x, y: o.y + s.height * 0.7 }
  ]);
};

const arrowLeft = (o: Point, s: Size): string => {
  const bodyStartX = o.x + s.width * 0.3;
  return closedPolygon([
    { x: o.x + s.width, y: o.y + s.height * 0.3 },
    { x: bodyStartX, y: o.y + s.height * 0.3 },
    { x: bodyStartX, y: o.y },
    { x: o.x, y: o.y + s.height / 2 },
    { x: bodyStartX, y: o.y + s.height },
    { x: bodyStartX, y: o.y + s.height * 0.7 },
    { x: o.x + s.width, y: o.y + s.height * 0.7 }
  ]);
};

// Chevron: rightward-pointing pentagon (rectangle with one side replaced by a point).
const chevron = (o: Point, s: Size): string =>
  closedPolygon([
    { x: o.x, y: o.y },
    { x: o.x + s.width * 0.75, y: o.y },
    { x: o.x + s.width, y: o.y + s.height / 2 },
    { x: o.x + s.width * 0.75, y: o.y + s.height },
    { x: o.x, y: o.y + s.height }
  ]);

const parallelogramRight = (o: Point, s: Size): string => {
  const slant = s.width * 0.2;
  return closedPolygon([
    { x: o.x + slant, y: o.y },
    { x: o.x + s.width, y: o.y },
    { x: o.x + s.width - slant, y: o.y + s.height },
    { x: o.x, y: o.y + s.height }
  ]);
};

const parallelogramLeft = (o: Point, s: Size): string => {
  const slant = s.width * 0.2;
  return closedPolygon([
    { x: o.x, y: o.y },
    { x: o.x + s.width - slant, y: o.y },
    { x: o.x + s.width, y: o.y + s.height },
    { x: o.x + slant, y: o.y + s.height }
  ]);
};

// Trapezoid with the narrower edge at the top.
const trapezoid = (o: Point, s: Size): string => {
  const slant = s.width * 0.15;
  return closedPolygon([
    { x: o.x + slant, y: o.y },
    { x: o.x + s.width - slant, y: o.y },
    { x: o.x + s.width, y: o.y + s.height },
    { x: o.x, y: o.y + s.height }
  ]);
};

// Flowchart internal-storage symbol: outer rectangle plus two inner dividers
// (one horizontal near top, one vertical near left). Encoded as three
// subpaths so Penpot's path renderer fills the outer rect and draws the
// dividers as open lines.
const internalStorage = (o: Point, s: Size): string => {
  const innerLeft = o.x + s.width * 0.2;
  const innerTop = o.y + s.height * 0.2;
  const rect = closedPolygon([
    { x: o.x, y: o.y },
    { x: o.x + s.width, y: o.y },
    { x: o.x + s.width, y: o.y + s.height },
    { x: o.x, y: o.y + s.height }
  ]);
  const verticalDivider = `M ${innerLeft} ${o.y} L ${innerLeft} ${o.y + s.height}`;
  const horizontalDivider = `M ${o.x} ${innerTop} L ${o.x + s.width} ${innerTop}`;
  return `${rect} ${verticalDivider} ${horizontalDivider}`;
};

export const translateShapeWithTextPath = (
  shapeType: PathShapeType,
  origin: Point,
  size: Size
): string => {
  switch (shapeType) {
    case 'DIAMOND':
      return diamond(origin, size);
    case 'TRIANGLE_UP':
      return triangleUp(origin, size);
    case 'TRIANGLE_DOWN':
      return triangleDown(origin, size);
    case 'HEXAGON':
      return hexagon(origin, size);
    case 'PENTAGON':
      return pentagon(origin, size);
    case 'OCTAGON':
      return octagon(origin, size);
    case 'STAR':
      return star(origin, size);
    case 'PLUS':
      return plus(origin, size);
    case 'ARROW_LEFT':
      return arrowLeft(origin, size);
    case 'ARROW_RIGHT':
      return arrowRight(origin, size);
    case 'CHEVRON':
      return chevron(origin, size);
    case 'PARALLELOGRAM_LEFT':
      return parallelogramLeft(origin, size);
    case 'PARALLELOGRAM_RIGHT':
      return parallelogramRight(origin, size);
    case 'TRAPEZOID':
      return trapezoid(origin, size);
    case 'INTERNAL_STORAGE':
      return internalStorage(origin, size);
  }
};
