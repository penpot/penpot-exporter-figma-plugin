import slugify from 'slugify';

import { loadGoogleFonts, loadLocalFonts } from '@plugin/utils';

import { LocalFont } from '@ui/lib/types/utils/localFont';

export const translateFontId = (fontName: FontName): string => {
  // is gfont
  if (isGfont(fontName.family)) {
    return `gfont-${slugify(fontName.family.toLowerCase())}`;
  }

  // is local font
  const localFont = getLocalFont(fontName.family);
  if (localFont !== undefined) {
    return localFont.family;
  }

  // always send font name if not gfont or local font
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  // @TODO: custom font
  return slugify(fontName.family.toLowerCase());
};

const isGfont = (fontFamily: string): boolean => {
  const foundFamily = loadGoogleFonts().find(gfont => gfont.family === fontFamily);

  return foundFamily !== undefined;
};

const getLocalFont = (fontFamily: string): LocalFont | undefined => {
  return loadLocalFonts().find(localFont => localFont.name === fontFamily);
};
