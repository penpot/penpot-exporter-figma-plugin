import { translateFontWeight } from '@plugin/translators/text/properties';

import { TextTypography } from '@ui/lib/types/shapes/textShape';

import { translateCustomFont } from './custom';
import { translateGoogleFont } from './gfonts';
import { translateLocalFont } from './local';

export const translateFontName = (
  fontName: FontName | undefined
): Pick<TextTypography, 'fontId' | 'fontVariantId' | 'fontWeight'> | undefined => {
  const fontWeight = translateFontWeight(fontName);

  return (
    translateGoogleFont(fontName, fontWeight) ??
    translateLocalFont(fontName, fontWeight) ??
    translateCustomFont(fontName, fontWeight)
  );
};
