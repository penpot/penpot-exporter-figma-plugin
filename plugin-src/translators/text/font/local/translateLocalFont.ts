import { LocalFont, translateFontVariantId } from '@plugin/translators/text/font/local';

import { FontId } from '@ui/lib/types/shapes/textShape';

import { items as localFonts } from './localFonts.json';

export const translateLocalFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  const localFont = getLocalFont(fontName);

  if (localFont === undefined) return;

  return {
    fontId: localFont.id,
    fontVariantId: translateFontVariantId(localFont, fontName, fontWeight)
  };
};

export const isLocalFont = (fontName: FontName): boolean => {
  return getLocalFont(fontName) !== undefined;
};

const getLocalFont = (fontName: FontName): LocalFont | undefined => {
  return localFonts.find(localFont => localFont.name === fontName.family);
};
