import slugify from 'slugify';

import { translateFontVariantId } from '@plugin/translators/text/font/gfonts';
import type { GoogleFont } from '@plugin/translators/text/font/gfonts/googleFont';

import type { TextTypography } from '@ui/lib/types/shapes/textShape';

import { items as gfonts } from './gfonts.json';

/**
 * Pre-built Map for O(1) font lookups by family name.
 * Initialized once at module load instead of searching through 1,832 fonts per text segment.
 * Replaces the previous LRU cache which still required O(n) search on cache misses.
 */
const gfontsByFamily = new Map<string, GoogleFont>(gfonts.map(font => [font.family, font]));

export const translateGoogleFont = (
  fontName: FontName | undefined,
  fontWeight: string
): Pick<TextTypography, 'fontId' | 'fontVariantId' | 'fontWeight'> | undefined => {
  if (!fontName) return;

  const googleFont = getGoogleFont(fontName);

  if (googleFont === undefined) return;

  return {
    fontId: `gfont-${slugify(fontName.family.toLowerCase())}`,
    fontVariantId: translateFontVariantId(googleFont, fontName, fontWeight),
    fontWeight
  };
};

const getGoogleFont = (fontName: FontName | undefined): GoogleFont | undefined => {
  if (!fontName) return;

  return gfontsByFamily.get(fontName.family);
};
