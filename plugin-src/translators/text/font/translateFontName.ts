import { translateCustomFont } from '@plugin/translators/text/font/custom';
import { translateGoogleFont } from '@plugin/translators/text/font/gfonts';
import { translateLocalFont } from '@plugin/translators/text/font/local';
import { translateFontWeight } from '@plugin/translators/text/properties';

import { TextTypography } from '@ui/lib/types/shapes/textShape';

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
