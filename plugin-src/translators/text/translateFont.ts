import { FontId } from '@ui/lib/types/text/textContent';

import { translateCustomFont } from './custom';
import { translateGoogleFont } from './gfonts';
import { translateLocalFont } from './local';

export const translateFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  return (
    translateGoogleFont(fontName, fontWeight) ??
    translateLocalFont(fontName, fontWeight) ??
    translateCustomFont(fontName)
  );
};
