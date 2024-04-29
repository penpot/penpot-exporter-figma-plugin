import slugify from 'slugify';

import { loadGoogleFonts } from '@plugin/utils';

export const translateFontId = (fontName: FontName): string => {
  // is gfont
  if (isGfont(fontName.family)) {
    return `gfont-${slugify(fontName.family.toLowerCase())}`;
  }

  // @TODO: check if source sans pro

  // always send font name if not gfont or source sans pro
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  // @TODO: custom font
  return slugify(fontName.family.toLowerCase());
};

const isGfont = (fontFamily: string): boolean => {
  const foundFamily = loadGoogleFonts().find(gfont => gfont.family === fontFamily);

  return foundFamily !== undefined;
};
