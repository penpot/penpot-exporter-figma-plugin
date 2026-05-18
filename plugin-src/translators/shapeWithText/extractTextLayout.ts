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

// Conservative glyph-width-to-fontSize ratio used as a lower bound on the wrap
// container width. The ratio inferred from Figma's tspan deltas captures the
// AVERAGE width assuming uniform glyphs, which is consistently narrower than
// Penpot's real glyph rendering — using only the derived width causes Penpot
// to over-wrap. This bound is also the single-tspan fallback.
const FALLBACK_CHAR_WIDTH_RATIO = 0.55;

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

// Centered multi-line text in Figma's SVG export shows each line's tspan.x as
// `boxLeft + (boxWidth - lineWidth) / 2`. Pick the longest and shortest lines
// (by char count) to back out an effective char-width ratio for this font.
const deriveCharWidthRatio = (tspans: Tspan[], fontSize: number): number => {
  if (tspans.length < 2) return FALLBACK_CHAR_WIDTH_RATIO;

  let widest = tspans[0];
  let narrowest = tspans[0];
  for (const t of tspans) {
    if (t.chars > widest.chars) widest = t;
    if (t.chars < narrowest.chars) narrowest = t;
  }

  const charsDelta = widest.chars - narrowest.chars;
  if (charsDelta <= 0) return FALLBACK_CHAR_WIDTH_RATIO;

  // tspan.x of the widest line is smallest (line takes the most space, so it's
  // pushed least to the right by centering).
  const xDelta = narrowest.x - widest.x;
  const ratio = (2 * xDelta) / (charsDelta * fontSize);

  return Number.isFinite(ratio) && ratio > 0 ? ratio : FALLBACK_CHAR_WIDTH_RATIO;
};

const textLocalBounds = (tspans: Tspan[], fontSize: number): Bounds => {
  const ratio = deriveCharWidthRatio(tspans, fontSize);
  const lineWidths = tspans.map(t => t.chars * fontSize * ratio);

  // Under the derived ratio each line's center coincides (that's the property
  // the ratio is solved for). Take any line's center as the box centre.
  const centerX = tspans[0].x + lineWidths[0] / 2;

  // The derived width captures the AVERAGE glyph width under uniform-glyph
  // assumption, which underestimates Penpot's real glyph rendering and causes
  // over-wrapping. Floor the width at the fallback ratio applied to the
  // longest line so the wrap container stays roomy enough.
  const maxChars = Math.max(...tspans.map(t => t.chars));
  const width = Math.max(Math.max(...lineWidths), maxChars * fontSize * FALLBACK_CHAR_WIDTH_RATIO);

  const top = Math.min(...tspans.map(t => t.y)) - fontSize * ASCENDER_RATIO;
  const bottom = Math.max(...tspans.map(t => t.y)) + fontSize * DESCENDER_RATIO;

  return { x: centerX - width / 2, y: top, width, height: bottom - top };
};

export const extractTextLayout = (
  svg: string,
  aabb: { x: number; y: number }
): Pick<ShapeGeomAttributes, 'x' | 'y' | 'width' | 'height'> | undefined => {
  const textMatch = stripSvgDefs(svg).match(/<text\b([^>]*)>([\s\S]*?)<\/text>/i);
  if (!textMatch) return;

  const attrs = parseSvgAttrs(textMatch[1]);
  const tspans = parseTspans(textMatch[2]);
  if (tspans.length === 0) return;

  const fontSize = parseFloat(attrs['font-size'] ?? '');
  if (!Number.isFinite(fontSize) || fontSize <= 0) return;

  const local = textLocalBounds(tspans, fontSize);

  // Project the text's center through the <text transform> to land in AABB-
  // local space, then offset by the AABB origin. The text shape's own
  // rotation comes from the parent node via transformRotationAndPosition, so
  // the rotation component of the transform is reflected by Penpot rotating
  // the rect around its centre — we just position it.
  const elementTransform = parseSvgTransform(attrs.transform);
  const [cx, cy] = applyMatrixToPoint(elementTransform, [
    local.x + local.width / 2,
    local.y + local.height / 2
  ]);

  return {
    x: aabb.x + cx - local.width / 2,
    y: aabb.y + cy - local.height / 2,
    width: local.width,
    height: local.height
  };
};
