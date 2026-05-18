import { type Command, parseSVG } from 'svg-path-parser';

import {
  numAttr,
  parseSvgAttrs,
  parseSvgTransform,
  stripSvgDefs
} from '@plugin/translators/shapeWithText/parseSvg';
import { normalizeCommands, serializeCommands } from '@plugin/translators/vectors';
import { applyMatrixToCommand } from '@plugin/utils';

// Cubic Bézier approximation of a quarter ellipse — (4/3) * (sqrt(2) - 1).
// Used because the downstream path translator only handles M/L/C/Z commands.
const KAPPA = 0.5522847498307933;

// SVG primitives Figma may emit inside a shape-with-text export.
const DRAWABLE_TAGS = ['path', 'rect', 'circle', 'ellipse', 'polygon'] as const;
type DrawableTag = (typeof DRAWABLE_TAGS)[number];

const rectToPath = (attrs: Record<string, string>): string => {
  const x = numAttr(attrs.x);
  const y = numAttr(attrs.y);
  const width = numAttr(attrs.width);
  const height = numAttr(attrs.height);

  // SVG spec: if only one of rx/ry is given, the other defaults to it. Treat
  // missing attributes as "use the other axis"; if both missing, no rounding.
  const rxRaw = attrs.rx !== undefined ? numAttr(attrs.rx) : undefined;
  const ryRaw = attrs.ry !== undefined ? numAttr(attrs.ry) : undefined;
  const rx = Math.min(rxRaw ?? ryRaw ?? 0, width / 2);
  const ry = Math.min(ryRaw ?? rxRaw ?? 0, height / 2);

  if (rx <= 0 || ry <= 0) {
    return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
  }

  // Rounded rect via cubic Bézier corners, traced top-left clockwise.
  const ox = rx * KAPPA;
  const oy = ry * KAPPA;
  const x0 = x;
  const x1 = x + rx;
  const x2 = x + width - rx;
  const x3 = x + width;
  const y0 = y;
  const y1 = y + ry;
  const y2 = y + height - ry;
  const y3 = y + height;

  return [
    `M ${x1} ${y0}`,
    `L ${x2} ${y0}`,
    `C ${x2 + ox} ${y0} ${x3} ${y1 - oy} ${x3} ${y1}`,
    `L ${x3} ${y2}`,
    `C ${x3} ${y2 + oy} ${x2 + ox} ${y3} ${x2} ${y3}`,
    `L ${x1} ${y3}`,
    `C ${x1 - ox} ${y3} ${x0} ${y2 + oy} ${x0} ${y2}`,
    `L ${x0} ${y1}`,
    `C ${x0} ${y1 - oy} ${x1 - ox} ${y0} ${x1} ${y0}`,
    'Z'
  ].join(' ');
};

const ellipseToPath = (cx: number, cy: number, rx: number, ry: number): string => {
  if (rx === 0 || ry === 0) return '';

  const ox = rx * KAPPA;
  const oy = ry * KAPPA;

  return [
    `M ${cx} ${cy - ry}`,
    `C ${cx + ox} ${cy - ry} ${cx + rx} ${cy - oy} ${cx + rx} ${cy}`,
    `C ${cx + rx} ${cy + oy} ${cx + ox} ${cy + ry} ${cx} ${cy + ry}`,
    `C ${cx - ox} ${cy + ry} ${cx - rx} ${cy + oy} ${cx - rx} ${cy}`,
    `C ${cx - rx} ${cy - oy} ${cx - ox} ${cy - ry} ${cx} ${cy - ry}`,
    'Z'
  ].join(' ');
};

const polygonToPath = (attrs: Record<string, string>): string => {
  const tokens = (attrs.points ?? '')
    .trim()
    .split(/[\s,]+/)
    .map(parseFloat);

  if (tokens.length < 4 || tokens.length % 2 !== 0) {
    console.warn('Skipping <polygon> with malformed points attribute', { points: attrs.points });
    return '';
  }

  const cmds: string[] = [`M ${tokens[0]} ${tokens[1]}`];
  for (let i = 2; i < tokens.length; i += 2) {
    cmds.push(`L ${tokens[i]} ${tokens[i + 1]}`);
  }
  cmds.push('Z');

  return cmds.join(' ');
};

const PRIMITIVE_TO_PATH: Record<DrawableTag, (attrs: Record<string, string>) => string> = {
  path: attrs => attrs.d ?? '',
  rect: rectToPath,
  circle: attrs =>
    ellipseToPath(numAttr(attrs.cx), numAttr(attrs.cy), numAttr(attrs.r), numAttr(attrs.r)),
  ellipse: attrs =>
    ellipseToPath(numAttr(attrs.cx), numAttr(attrs.cy), numAttr(attrs.rx), numAttr(attrs.ry)),
  polygon: polygonToPath
};

type Drawable = { pathData: string; transform: Transform };

const extractDrawablePaths = (svg: string): Drawable[] => {
  const drawable = stripSvgDefs(svg);
  const regex = new RegExp(`<(${DRAWABLE_TAGS.join('|')})\\b([^>]*?)\\/?>`, 'gi');
  const out: Drawable[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(drawable)) !== null) {
    const tag = match[1].toLowerCase() as DrawableTag;
    const attrs = parseSvgAttrs(match[2]);
    const pathData = PRIMITIVE_TO_PATH[tag](attrs);
    if (!pathData) continue;
    out.push({ pathData, transform: parseSvgTransform(attrs.transform) });
  }

  return out;
};

const parseAndTransform = (node: ShapeWithTextNode, drawables: Drawable[]): Command[][] => {
  const subpaths: Command[][] = [];

  for (const { pathData, transform } of drawables) {
    let commands: Command[];
    try {
      commands = normalizeCommands(parseSVG(pathData));
    } catch {
      console.warn('Skipping shape-with-text subpath with invalid SVG', {
        nodeId: node.id,
        nodeName: node.name,
        shapeType: node.shapeType
      });
      continue;
    }
    subpaths.push(commands.map(c => applyMatrixToCommand(c, transform)));
  }

  return subpaths;
};

// Coordinates that contribute to a command's reach. Control points are
// included; for the cubic approximations the geometry helpers emit, they stay
// within the shape's visual bounds.
const commandPoints = (c: Command): Array<readonly [number, number]> => {
  switch (c.command) {
    case 'moveto':
    case 'lineto':
      return [[c.x, c.y]];
    case 'curveto':
      return [
        [c.x1, c.y1],
        [c.x2, c.y2],
        [c.x, c.y]
      ];
    default:
      return [];
  }
};

const computeBounds = (subpaths: Command[][]): { minX: number; minY: number } | undefined => {
  let minX = Infinity;
  let minY = Infinity;

  for (const commands of subpaths) {
    for (const c of commands) {
      for (const [x, y] of commandPoints(c)) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
      }
    }
  }

  return Number.isFinite(minX) ? { minX, minY } : undefined;
};

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

  const subpaths = parseAndTransform(node, drawables);
  const bounds = computeBounds(subpaths);
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
