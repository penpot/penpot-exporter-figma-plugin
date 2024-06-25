import { translateFontName } from '@plugin/translators/text/font';
import {
  translateFontStyle,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators/text/properties';

import { TypographyStyle } from '@ui/lib/types/shapes/textShape';

export const translateTextStyle = (figmaStyle: TextStyle): TypographyStyle => {
  const path = figmaStyle.remote ? 'Remote / ' : '';

  return {
    name: figmaStyle.name,
    textStyle: {
      ...translateFontName(figmaStyle.fontName),
      fontFamily: figmaStyle.fontName.family,
      fontSize: figmaStyle.fontSize.toString(),
      fontStyle: translateFontStyle(figmaStyle.fontName.style),
      textDecoration: translateTextDecoration(figmaStyle),
      letterSpacing: translateLetterSpacing(figmaStyle),
      textTransform: translateTextTransform(figmaStyle),
      lineHeight: translateLineHeight(figmaStyle)
    },
    typography: {
      path,
      name: figmaStyle.name
    }
  };
};
