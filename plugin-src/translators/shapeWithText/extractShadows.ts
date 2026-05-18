import { numAttr, parseSvgAttrs } from '@plugin/translators/shapeWithText/parseSvg';
import { generateUuid, rgbToHex } from '@plugin/utils';

import type { Shadow, ShadowStyle } from '@ui/lib/types/utils/shadow';

// Figma's plugin API types ShapeWithTextNode with MinimalBlendMixin only, so
// node.effects is not accessible at runtime — yet Figma's UI still lets users
// add shadow/blur on shape-with-text and exports them inside the SVG. Parse
// the SVG <filter> definitions to recover the shadow so it survives the
// round-trip into Penpot.
//
// Figma's shape-with-text shadow presets ("low" / "medium" / "high") stack
// multiple drop-shadow layers inside one <filter>. Each layer is a chain of
// (optional) feMorphology → feOffset → feGaussianBlur → feColorMatrix,
// separated from the next layer by a `feColorMatrix in="SourceAlpha"` reset.
// The filter id encodes the layer types in order — e.g. `filter0_dddd_` is
// four stacked drop shadows, `filter0_did_` is drop-inner-drop.

// Filter element regexes are evaluated per-call (no shared lastIndex) to avoid
// reentrancy bugs and keep this module's behaviour deterministic.
const filterRegex = (): RegExp => /<filter\b([^>]*)>([\s\S]*?)<\/filter>/gi;
const sourceAlphaResetRegex = (): RegExp =>
  /<feColorMatrix\b[^>]*\bin\s*=\s*"SourceAlpha"[^>]*\/>/gi;
const feColorMatrixRegex = (): RegExp => /<feColorMatrix\b([^/>]*)\/?>/g;
const FE_OFFSET = /<feOffset\b([^/>]*)\/?>/;
const FE_BLUR = /<feGaussianBlur\b([^/>]*)\/?>/;
const FE_MORPHOLOGY = /<feMorphology\b([^/>]*)\/?>/;
const FILTER_ID_LETTERS = /^filter\d+_([a-z]+)_/i;

// Indices into the flattened 4x5 feColorMatrix `values` attribute. The matrix
// rows are (R_out G_out B_out A_out) and the columns are (R_in G_in B_in A_in
// 1). Figma's shadow colour matrix sets the RGB constants on each row's last
// column and the alpha multiplier at row 4 column 4.
const COLOR_MATRIX_INDEX = {
  R: 4,
  G: 9,
  B: 14,
  A: 18
} as const;

const STYLE_BY_LETTER: Record<string, ShadowStyle> = {
  d: 'drop-shadow',
  i: 'inner-shadow'
};

const parseShadowStyles = (id: string): ShadowStyle[] => {
  const match = id.match(FILTER_ID_LETTERS);
  if (!match) return [];

  return Array.from(match[1].toLowerCase(), letter => STYLE_BY_LETTER[letter]).filter(
    (style): style is ShadowStyle => style !== undefined
  );
};

type ParsedColor = { r: number; g: number; b: number; a: number };

const BLACK_OPAQUE: ParsedColor = { r: 0, g: 0, b: 0, a: 1 };

const parseColorMatrix = (values: string): ParsedColor => {
  const nums = values
    .trim()
    .split(/[\s,]+/)
    .map(parseFloat);

  if (nums.length < 20 || nums.some(n => !Number.isFinite(n))) return BLACK_OPAQUE;

  return {
    r: nums[COLOR_MATRIX_INDEX.R],
    g: nums[COLOR_MATRIX_INDEX.G],
    b: nums[COLOR_MATRIX_INDEX.B],
    a: nums[COLOR_MATRIX_INDEX.A]
  };
};

const findColorMatrixValues = (chain: string): string | undefined => {
  // The chain may have a leading `in="SourceAlpha"` matrix (the boundary that
  // opened it) — skip those and return the last colour-applying matrix.
  const regex = feColorMatrixRegex();
  let lastValues: string | undefined;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(chain)) !== null) {
    const attrs = parseSvgAttrs(match[1]);
    if (attrs.in === 'SourceAlpha') continue;
    if (attrs.values) lastValues = attrs.values;
  }

  return lastValues;
};

const extractSpread = (chain: string): number => {
  // Figma encodes shadow spread as `feMorphology operator="dilate"` (positive)
  // or `operator="erode"` (negative, common on inner shadows and some
  // elevation presets).
  const morphMatch = chain.match(FE_MORPHOLOGY);
  if (!morphMatch) return 0;

  const attrs = parseSvgAttrs(morphMatch[1]);
  const radius = numAttr(attrs.radius);
  if (radius === 0) return 0;

  return attrs.operator === 'erode' ? -radius : radius;
};

const buildShadow = (chain: string, style: ShadowStyle): Shadow | undefined => {
  const offsetMatch = chain.match(FE_OFFSET);
  const blurMatch = chain.match(FE_BLUR);
  if (!offsetMatch || !blurMatch) return;

  const offsetAttrs = parseSvgAttrs(offsetMatch[1]);
  const blurAttrs = parseSvgAttrs(blurMatch[1]);
  const colorValues = findColorMatrixValues(chain);
  const color = colorValues ? parseColorMatrix(colorValues) : BLACK_OPAQUE;

  // Figma's UI "Blur" value maps 1:1 to SVG feGaussianBlur stdDeviation in the
  // export, which in turn maps 1:1 to Penpot's Shadow.blur — same convention
  // used by translateShadowEffects for non-shape-with-text nodes.
  return {
    id: generateUuid(),
    style,
    offsetX: numAttr(offsetAttrs.dx),
    offsetY: numAttr(offsetAttrs.dy),
    blur: numAttr(blurAttrs.stdDeviation),
    spread: extractSpread(chain),
    hidden: false,
    color: {
      color: rgbToHex({ r: color.r, g: color.g, b: color.b }),
      opacity: color.a
    }
  };
};

const splitChains = (body: string): string[] => {
  // The leading segment (before the first SourceAlpha reset) is the filter
  // preamble (feFlood etc.) — drop it. Each remaining segment is one shadow
  // chain matched 1:1 with the style letters in the filter id.
  return body.split(sourceAlphaResetRegex()).slice(1);
};

const extractFilterShadows = (id: string, body: string): Shadow[] => {
  const styles = parseShadowStyles(id);
  if (styles.length === 0) return [];

  const chains = splitChains(body);

  return styles.flatMap((style, index) => {
    // If chain count diverges from style count (defensive), reuse the last
    // available chain so a malformed filter doesn't drop shadows silently.
    const chain = chains[index] ?? chains[chains.length - 1];
    if (!chain) return [];

    const shadow = buildShadow(chain, style);
    return shadow ? [shadow] : [];
  });
};

export const extractShadows = (svg: string): Shadow[] => {
  const shadows: Shadow[] = [];
  const regex = filterRegex();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(svg)) !== null) {
    const id = parseSvgAttrs(match[1]).id ?? '';
    shadows.push(...extractFilterShadows(id, match[2]));
  }

  return shadows;
};
