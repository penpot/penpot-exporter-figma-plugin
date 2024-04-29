import slugify from 'slugify';

import fonts from '@plugin/gfonts.json';

import { Gfont } from '@ui/lib/types/utils/gfont';

const gfonts: Gfont[] = fonts.items;

export const translateFontId = (fontName: FontName): string => {
  // is gfont
  if (isGfont(fontName.family)) {
    return `gfont-${slugify(fontName.family.toLowerCase())}`;
  }

  // always send font name if not gfont or source sans pro
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  // @TODO: check if source sans pro
  // @TODO: custom font
  return slugify(fontName.family.toLowerCase());
};

const isGfont = (fontFamily: string): boolean => {
  const foundFamily = gfonts.find(gfont => gfont.family === fontFamily);

  return foundFamily !== undefined;
};
