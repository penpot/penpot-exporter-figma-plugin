import slugify from 'slugify';

import { Cache } from '@plugin/Cache';
import { translateFontVariantId } from '@plugin/translators/text/font/gfonts';

import { FontId } from '@ui/lib/types/shapes/textShape';

import { items as gfonts } from './gfonts.json';
import { GoogleFont } from './googleFont';

const fontsCache = new Cache<string, GoogleFont>({ max: 30 });

export const translateGoogleFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  const googleFont = getGoogleFont(fontName);

  if (googleFont === undefined) return;

  return {
    fontId: `gfont-${slugify(fontName.family.toLowerCase())}`,
    fontVariantId: translateFontVariantId(googleFont, fontName, fontWeight)
  };
};

export const isGoogleFont = (fontName: FontName): boolean => {
  return getGoogleFont(fontName) !== undefined;
};

const getGoogleFont = (fontName: FontName): GoogleFont | undefined => {
  return fontsCache.get(fontName.family, () =>
    gfonts.find(font => font.family === fontName.family)
  );
};
