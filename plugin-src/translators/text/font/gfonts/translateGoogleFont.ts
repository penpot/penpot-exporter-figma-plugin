import slugify from 'slugify';

import { Cache } from '@plugin/Cache';
import { translateFontVariantId } from '@plugin/translators/text/font/gfonts';
import { GoogleFont } from '@plugin/translators/text/font/gfonts/googleFont';

import { TextTypography } from '@ui/lib/types/shapes/textShape';

import { items as gfonts } from './gfonts.json';

const fontsCache = new Cache<string, GoogleFont>({ max: 30 });

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

export const isGoogleFont = (fontName: FontName | undefined): boolean => {
  return getGoogleFont(fontName) !== undefined;
};

const getGoogleFont = (fontName: FontName | undefined): GoogleFont | undefined => {
  if (!fontName) return;

  return fontsCache.get(fontName.family, () =>
    gfonts.find(font => font.family === fontName.family)
  );
};
