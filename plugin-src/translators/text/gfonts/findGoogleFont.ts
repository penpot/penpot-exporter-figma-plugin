import slugify from 'slugify';

import { items as gfonts } from '@plugin/gfonts.json';
import { translateFontVariantId } from '@plugin/translators/text/gfonts';

import { PenpotFont } from '@ui/lib/types/utils/penpotFont';

export const findGoogleFont = (fontName: FontName, fontWeight: number): PenpotFont | undefined => {
  const googleFont = getGoogleFont(fontName);

  if (googleFont !== undefined) {
    return {
      fontId: `gfont-${slugify(fontName.family.toLowerCase())}`,
      fontVariantId: translateFontVariantId(googleFont, fontName, fontWeight)
    };
  }
};

const getGoogleFont = (fontName: FontName) => {
  return gfonts.find(font => font.family === fontName.family);
};
