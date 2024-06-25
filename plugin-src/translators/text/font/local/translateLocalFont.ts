import { LocalFont, translateFontVariantId } from '@plugin/translators/text/font/local';

import { TextTypography } from '@ui/lib/types/shapes/textShape';

import { items as localFonts } from './localFonts.json';

export const translateLocalFont = (
  fontName: FontName,
  fontWeight: string
): Pick<TextTypography, 'fontId' | 'fontVariantId' | 'fontWeight'> | undefined => {
  const localFont = getLocalFont(fontName);

  if (localFont === undefined) return;

  return {
    fontId: localFont.id,
    fontVariantId: translateFontVariantId(localFont, fontName, fontWeight),
    fontWeight
  };
};

export const isLocalFont = (fontName: FontName): boolean => {
  return getLocalFont(fontName) !== undefined;
};

const getLocalFont = (fontName: FontName): LocalFont | undefined => {
  return localFonts.find(localFont => localFont.name === fontName.family);
};
