import slugify from 'slugify';

import {
  translateFontId as gfontTranslateFontId,
  translateFontVariantId as gfontTranslateFontVariantId,
  isGfont
} from './gfonts';
import {
  isLocalFont,
  translateFontId as localFontTranslateFontId,
  translateFontVariantId as localFontTranslateFontVariantId
} from './local';

export const translateFontId = (fontName: FontName): string => {
  // return getLocalFont ?? getGoogleFont ?? getCustomFont;

  if (isGfont(fontName)) {
    return gfontTranslateFontId(fontName);
  }

  if (isLocalFont(fontName)) {
    return localFontTranslateFontId(fontName);
  }

  // always send font name if custom font
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  // @TODO: custom font
  return slugify(fontName.family.toLowerCase());
};

export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
  if (isGfont(fontName)) {
    gfontTranslateFontVariantId(fontName, fontWeight);
  }

  if (isLocalFont(fontName)) {
    localFontTranslateFontVariantId(fontName, fontWeight);
  }

  // @TODO: Custom font
  return fontName.style.toLowerCase().replace(/\s/g, '');
};
