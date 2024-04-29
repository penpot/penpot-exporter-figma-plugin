import fonts from '@plugin/gfonts.json';

import { Gfont } from '@ui/lib/types/utils/gfont';

export const loadGoogleFonts = (): Gfont[] => {
  return fonts.items;
};
