import { FontId } from '@ui/lib/types/shapes/textShape';

import { translateCustomFont } from './custom';
import { translateGoogleFont } from './gfonts';
import { translateLocalFont } from './local';

export const translateFontId = (fontName: FontName, fontWeight: number): FontId | undefined => {
  return (
    translateGoogleFont(fontName, fontWeight) ??
    translateLocalFont(fontName, fontWeight) ??
    translateCustomFont(fontName, fontWeight)
  );
};
