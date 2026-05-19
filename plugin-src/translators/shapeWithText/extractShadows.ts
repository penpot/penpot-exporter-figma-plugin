import { numAttr, parseSvgAttrs } from '@plugin/translators/shapeWithText/parseSvg';
import { generateUuid, rgbToHex } from '@plugin/utils';

import type { Shadow, ShadowStyle } from '@ui/lib/types/utils/shadow';

const filterRegex = (): RegExp => /<filter\b([^>]*)>([\s\S]*?)<\/filter>/gi;
const sourceAlphaResetRegex = (): RegExp =>
  /<feColorMatrix\b[^>]*\bin\s*=\s*"SourceAlpha"[^>]*\/>/gi;
const feColorMatrixRegex = (): RegExp => /<feColorMatrix\b([^/>]*)\/?>/g;
const FE_OFFSET = /<feOffset\b([^/>]*)\/?>/;
const FE_BLUR = /<feGaussianBlur\b([^/>]*)\/?>/;
const FE_MORPHOLOGY = /<feMorphology\b([^/>]*)\/?>/;
const FILTER_ID_LETTERS = /^filter\d+_([a-z]+)_/i;

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

const splitChains = (body: string): string[] => body.split(sourceAlphaResetRegex()).slice(1);

const extractFilterShadows = (id: string, body: string): Shadow[] => {
  const styles = parseShadowStyles(id);
  if (styles.length === 0) return [];

  const chains = splitChains(body);

  return styles.flatMap((style, index) => {
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
