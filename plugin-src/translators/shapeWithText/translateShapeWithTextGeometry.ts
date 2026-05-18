import { type Command, parseSVG } from 'svg-path-parser';

import {
  numAttr,
  parseSvgAttrs,
  parseSvgTransform,
  stripSvgDefs
} from '@plugin/translators/shapeWithText/parseSvg';
import { normalizeCommands, serializeCommands } from '@plugin/translators/vectors';
import { multiplyMatrix } from '@plugin/utils';

// Cubic Bézier approximation of a quarter ellipse — (4/3) * (sqrt(2) - 1).
// Used because the downstream path translator only handles M/L/C/Z commands.
const KAPPA = 0.5522847498307933;

const rectToPath = (attrs: Record<string, string>): string => {
  const x = numAttr(attrs.x);
  const y = numAttr(attrs.y);
  const width = numAttr(attrs.width);
  const height = numAttr(attrs.height);

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
  ellipseToPath(numAttr(attrs.cx), numAttr(attrs.cy), numAttr(attrs.r), numAttr(attrs.r));

const ellipseElToPath = (attrs: Record<string, string>): string =>
  ellipseToPath(numAttr(attrs.cx), numAttr(attrs.cy), numAttr(attrs.rx), numAttr(attrs.ry));

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

const extractDrawablePaths = (svg: string): Array<{ pathData: string; transform: Transform }> => {
  const drawable = stripSvgDefs(svg);
  const regex = /<(path|rect|circle|ellipse|polygon)\b([^>]*?)\/?>/gi;
  const out: Array<{ pathData: string; transform: Transform }> = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(drawable)) !== null) {
    const tag = match[1].toLowerCase();
    const attrs = parseSvgAttrs(match[2]);
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
  const toCanvas: Transform = [
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
    parts.push(serializeCommands(commands, multiplyMatrix(toCanvas, transform)));
  }

  const joined = parts.join(' ').trim();
  return joined.length ? joined : undefined;
};
