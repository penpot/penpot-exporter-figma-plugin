import { translateCustomFont } from '@plugin/translators/text/font/custom';
import { remapFigJamFontName } from '@plugin/translators/text/font/figjamFontMap';
import { translateGoogleFont } from '@plugin/translators/text/font/gfonts';
import { translateLocalFont } from '@plugin/translators/text/font/local';
import { translateFontWeight } from '@plugin/translators/text/properties';

import type { TextTypography } from '@ui/lib/types/shapes/textShape';

export const translateFontName = (
  fontName: FontName | undefined
): Pick<TextTypography, 'fontId' | 'fontVariantId' | 'fontWeight'> | undefined => {
  const mappedFontName = remapFigJamFontName(fontName);
  const fontWeight = translateFontWeight(mappedFontName);

  return (
    translateGoogleFont(mappedFontName, fontWeight) ??
    translateLocalFont(mappedFontName, fontWeight) ??
    translateCustomFont(mappedFontName, fontWeight)
  );
};
