import slugify from 'slugify';

import { translateFontVariantId } from '@plugin/translators/text/gfonts';

import { FontId } from '@ui/lib/types/text/textContent';

import { items as gfonts } from './gfonts.json';
import { GoogleFont } from './googleFont';

export const translateGoogleFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  const googleFont = getGoogleFont(fontName);

  if (googleFont === undefined) return;

  return {
    fontId: `gfont-${slugify(fontName.family.toLowerCase())}`,
    fontVariantId: translateFontVariantId(googleFont, fontName, fontWeight)
  };
};

const getGoogleFont = (fontName: FontName): GoogleFont | undefined => {
  return gfonts.find(font => font.family === fontName.family);
};
