import slugify from 'slugify';

import { PenpotFont } from '@ui/lib/types/utils/penpotFont';

export const findCustomFont = (fontName: FontName): PenpotFont | undefined => {
  // always send font name if custom font
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  //@TODO: custom font
  return {
    fontId: slugify(fontName.family.toLowerCase()),
    fontVariantId: fontName.style.toLowerCase().replace(/\s/g, '')
  };
};
