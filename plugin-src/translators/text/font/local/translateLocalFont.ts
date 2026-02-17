import type { LocalFont } from '@plugin/translators/text/font/local';
import { translateFontVariantId } from '@plugin/translators/text/font/local';

import type { TextTypography } from '@ui/lib/types/shapes/textShape';

import { items as localFonts } from './localFonts.json';

/**
 * Pre-built Map for O(1) font lookups by family name.
 * Initialized once at module load for consistent lookup pattern.
 */
const localFontsByFamily = new Map<string, LocalFont>(localFonts.map(font => [font.name, font]));

export const translateLocalFont = (
  fontName: FontName | undefined,
  fontWeight: string
): Pick<TextTypography, 'fontId' | 'fontVariantId' | 'fontWeight'> | undefined => {
  if (!fontName) return;

  const localFont = getLocalFont(fontName);

  if (localFont === undefined) return;

  return {
    fontId: localFont.id,
    fontVariantId: translateFontVariantId(localFont, fontName, fontWeight),
    fontWeight
  };
};

const getLocalFont = (fontName: FontName | undefined): LocalFont | undefined => {
  if (!fontName) return;

  return localFontsByFamily.get(fontName.family);
};
