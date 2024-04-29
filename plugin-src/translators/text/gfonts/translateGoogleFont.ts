import slugify from 'slugify';

import { items as gfonts } from '@plugin/gfonts.json';
import { translateFontVariantId } from '@plugin/translators/text/gfonts';

import { FontId } from '@ui/lib/types/text/textContent';

export const translateGoogleFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  const googleFont = getGoogleFont(fontName);

  if (googleFont === undefined) return;

  return {
    fontId: `gfont-${slugify(fontName.family.toLowerCase())}`,
    fontVariantId: translateFontVariantId(googleFont, fontName, fontWeight)
  };
};

const getGoogleFont = (fontName: FontName) => {
  return gfonts.find(font => font.family === fontName.family);
};
