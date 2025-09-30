import type { LocalFont } from '@plugin/translators/text/font/local';
import { translateFontVariantId } from '@plugin/translators/text/font/local';

import type { TextTypography } from '@ui/lib/types/shapes/textShape';

import { items as localFonts } from './localFonts.json';

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

export const isLocalFont = (fontName: FontName | undefined): boolean => {
  return getLocalFont(fontName) !== undefined;
};

const getLocalFont = (fontName: FontName | undefined): LocalFont | undefined => {
  if (!fontName) return;

  return localFonts.find(localFont => localFont.name === fontName.family);
};
