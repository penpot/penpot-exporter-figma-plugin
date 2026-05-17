import { type Command, parseSVG } from 'svg-path-parser';

import { normalizeCommands } from '@plugin/translators/shapeWithText/normalizeCommands';
import {
  type AffineMatrix,
  multiply,
  parseSvgTransform
} from '@plugin/translators/shapeWithText/parseSvgTransform';
import { applyMatrixToPoint } from '@plugin/utils';

// Cubic Bézier approximation of a quarter ellipse — (4/3) * (sqrt(2) - 1).
// Used because the downstream path translator only handles M/L/C/Z commands.
const KAPPA = 0.5522847498307933;

const DEFS_REGEX = /<defs\b[^>]*>[\s\S]*?<\/defs>/gi;
const SHAPE_TAG_REGEX = /<(path|rect|circle|ellipse|polygon)\b([^>]*?)\/?>/gi;
const ATTR_REGEX = /([\w-]+)\s*=\s*"([^"]*)"/g;

const num = (value: string | undefined, fallback = 0): number => {
  if (value === undefined) return fallback;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseAttrs = (input: string): Record<string, string> => {
  const result: Record<string, string> = {};
  ATTR_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = ATTR_REGEX.exec(input)) !== null) {
    result[match[1]] = match[2];
  }

  return result;
};

const rectToPath = (attrs: Record<string, string>): string => {
  const x = num(attrs.x);
  const y = num(attrs.y);
  const width = num(attrs.width);
  const height = num(attrs.height);

  return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
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

const circleElToPath = (attrs: Record<string, string>): string =>
  ellipseToPath(num(attrs.cx), num(attrs.cy), num(attrs.r), num(attrs.r));

const ellipseElToPath = (attrs: Record<string, string>): string =>
  ellipseToPath(num(attrs.cx), num(attrs.cy), num(attrs.rx), num(attrs.ry));

const polygonToPath = (attrs: Record<string, string>): string => {
  const tokens = (attrs.points ?? '')
    .trim()
    .split(/[\s,]+/)
    .map(parseFloat);

  if (tokens.length < 4 || tokens.length % 2 !== 0) return '';

  const cmds: string[] = [`M ${tokens[0]} ${tokens[1]}`];
  for (let i = 2; i < tokens.length; i += 2) {
    cmds.push(`L ${tokens[i]} ${tokens[i + 1]}`);
  }
  cmds.push('Z');

  return cmds.join(' ');
};

const shapeToPath = (tag: string, attrs: Record<string, string>): string => {
  switch (tag) {
    case 'path':
      return attrs.d ?? '';
    case 'rect':
      return rectToPath(attrs);
    case 'circle':
      return circleElToPath(attrs);
    case 'ellipse':
      return ellipseElToPath(attrs);
    case 'polygon':
      return polygonToPath(attrs);
    default:
      return '';
  }
};

const serializeCommands = (commands: Command[], matrix: AffineMatrix): string => {
  const project = (x: number, y: number): number[] => applyMatrixToPoint(matrix, [x, y]);

  const parts: string[] = [];

  for (const c of commands) {
    switch (c.command) {
      case 'moveto': {
        const [x, y] = project(c.x, c.y);
        parts.push(`M ${x} ${y}`);
        break;
      }
      case 'lineto': {
        const [x, y] = project(c.x, c.y);
        parts.push(`L ${x} ${y}`);
        break;
      }
      case 'curveto': {
        const [x1, y1] = project(c.x1, c.y1);
        const [x2, y2] = project(c.x2, c.y2);
        const [x, y] = project(c.x, c.y);
        parts.push(`C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`);
        break;
      }
      case 'closepath':
        parts.push('Z');
        break;
    }
  }

  return parts.join(' ');
};

const extractDrawablePaths = (
  svg: string
): Array<{ pathData: string; transform: AffineMatrix }> => {
  // Drop <defs> so clipPath/mask/gradient geometry isn't mistaken for the shape itself.
  const drawable = svg.replace(DEFS_REGEX, '');
  const out: Array<{ pathData: string; transform: AffineMatrix }> = [];
  SHAPE_TAG_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = SHAPE_TAG_REGEX.exec(drawable)) !== null) {
    const tag = match[1].toLowerCase();
    const attrs = parseAttrs(match[2]);
    const pathData = shapeToPath(tag, attrs);
    if (!pathData) continue;
    out.push({ pathData, transform: parseSvgTransform(attrs.transform) });
  }

  return out;
};

export const translateShapeWithTextGeometry = (
  node: ShapeWithTextNode,
  svg: string,
  aabb: Rect
): string | undefined => {
  const drawables = extractDrawablePaths(svg);
  if (drawables.length === 0) {
    console.warn('Skipping shape-with-text with no extractable path', {
      nodeId: node.id,
      nodeName: node.name,
      shapeType: node.shapeType
    });
    return;
  }

  // Figma's SVG export places shapes in an AABB-sized viewBox and rotates them
  // via per-element `transform` attributes. Apply each element's transform to
  // its commands so the path lives in AABB-local coords, then translate by the
  // AABB's canvas position to land on the page.
  const toCanvas: AffineMatrix = [
    [1, 0, aabb.x],
    [0, 1, aabb.y]
  ];

  const parts: string[] = [];

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
    parts.push(serializeCommands(commands, multiply(toCanvas, transform)));
  }

  const joined = parts.join(' ').trim();
  return joined.length ? joined : undefined;
};
