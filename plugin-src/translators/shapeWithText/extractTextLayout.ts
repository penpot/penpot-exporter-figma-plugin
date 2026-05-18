import {
  numAttr,
  parseSvgAttrs,
  parseSvgTransform,
  stripSvgDefs
} from '@plugin/translators/shapeWithText/parseSvg';
import { applyMatrixToPoint } from '@plugin/utils';

import type { ShapeGeomAttributes } from '@ui/lib/types/shapes/shape';

// Figma's SVG export lays out the text precisely via tspan x/y per line. We
// derive the text box from those tspans so the Penpot text shape lands inside
// the parent shape instead of spanning the whole AABB.

// Glyph-width-to-fontSize ratio approximating Inter Bold (Figma Slides' default
// for shape-with-text). Used to estimate per-line centres from tspan.x — the
// real ratio varies per glyph so averaging across lines absorbs the drift.
const CENTER_CHAR_WIDTH_RATIO = 0.55;

// Width ratio for sizing the wrap container. Larger than the centring ratio so
// Penpot's real glyph rendering (which uses wider faces than Inter at the
// same nominal size, especially on bold uppercase like "DII ENERO 2026")
// doesn't over-wrap text to a second line. The box is centred on the same
// point either way, so this only affects how much horizontal room the text
// gets before Penpot decides to wrap.
const WRAP_CHAR_WIDTH_RATIO = 0.7;

// Approximate ascender / descender splits around the baseline.
const ASCENDER_RATIO = 0.8;
const DESCENDER_RATIO = 0.2;

type Tspan = { x: number; y: number; chars: number };

type Bounds = { x: number; y: number; width: number; height: number };

const decodeCodePointEntity = (value: string, radix: number, fallback: string): string => {
  const codePoint = parseInt(value, radix);
  return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : fallback;
};

const decodeXmlText = (input: string): string => {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (match, hex: string) => decodeCodePointEntity(hex, 16, match))
    .replace(/&#([0-9]+);/g, (match, decimal: string) => decodeCodePointEntity(decimal, 10, match))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
};

const countTextChars = (input: string): number => Array.from(decodeXmlText(input)).length;

const parseTspans = (body: string): Tspan[] => {
  const regex = /<tspan\b([^>]*)>([\s\S]*?)<\/tspan>/g;
  const tspans: Tspan[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    const attrs = parseSvgAttrs(match[1]);
    tspans.push({
      x: numAttr(attrs.x),
      y: numAttr(attrs.y),
      chars: countTextChars(match[2])
    });
  }

  return tspans;
};

const textLocalBounds = (tspans: Tspan[], fontSize: number): Bounds => {
  // Each tspan.x is the left edge of its line. Estimating that line's centre
  // under the centring ratio and averaging across lines lands very close to
  // Figma's rendered centre. Earlier versions tried to back out the real
  // char-width ratio from the relative tspan offsets, but that breaks when
  // lines differ only by narrow glyphs (e.g. a trailing space) and produces
  // wildly wrong centres.
  const lineCenters = tspans.map(t => t.x + (t.chars * fontSize * CENTER_CHAR_WIDTH_RATIO) / 2);
  const centerX = lineCenters.reduce((sum, c) => sum + c, 0) / lineCenters.length;

  // Wrap container width sized to the longest line at the wider wrap ratio.
  const maxChars = Math.max(...tspans.map(t => t.chars));
  const width = maxChars * fontSize * WRAP_CHAR_WIDTH_RATIO;

  const top = Math.min(...tspans.map(t => t.y)) - fontSize * ASCENDER_RATIO;
  const bottom = Math.max(...tspans.map(t => t.y)) + fontSize * DESCENDER_RATIO;

  return { x: centerX - width / 2, y: top, width, height: bottom - top };
};

export const extractTextLayout = (
  svg: string,
  aabb: { x: number; y: number },
  svgOrigin: { x: number; y: number } = { x: 0, y: 0 }
): Pick<ShapeGeomAttributes, 'x' | 'y' | 'width' | 'height'> | undefined => {
  const textMatch = stripSvgDefs(svg).match(/<text\b([^>]*)>([\s\S]*?)<\/text>/i);
  if (!textMatch) return;

  const attrs = parseSvgAttrs(textMatch[1]);
  const tspans = parseTspans(textMatch[2]);
  if (tspans.length === 0) return;

  const fontSize = parseFloat(attrs['font-size'] ?? '');
  if (!Number.isFinite(fontSize) || fontSize <= 0) return;

  const local = textLocalBounds(tspans, fontSize);

  // Project the text's center through the <text transform> to land in SVG-
  // local space, then translate to canvas: subtract svgOrigin (the geometry's
  // bounding-box top-left in SVG coords, which accounts for shadow/blur
  // margin Figma added to the viewBox) and add aabb. The text shape's own
  // rotation comes from the parent node via transformRotationAndPosition, so
  // the rotation component of the transform is reflected by Penpot rotating
  // the rect around its centre — we just position it.
  const elementTransform = parseSvgTransform(attrs.transform);
  const [cx, cy] = applyMatrixToPoint(elementTransform, [
    local.x + local.width / 2,
    local.y + local.height / 2
  ]);

  return {
    x: aabb.x + (cx - svgOrigin.x) - local.width / 2,
    y: aabb.y + (cy - svgOrigin.y) - local.height / 2,
    width: local.width,
    height: local.height
  };
};
