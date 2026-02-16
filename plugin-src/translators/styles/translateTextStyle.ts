import { translateStyleName, translateStylePath } from '@plugin/translators/styles';
import { translateFontName } from '@plugin/translators/text/font';
import {
  translateFontStyle,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators/text/properties';

import type { TypographyStyle } from '@ui/lib/types/shapes/textShape';

export const translateTextStyle = (figmaStyle: TextStyle): TypographyStyle => {
  return {
    name: translateStyleName(figmaStyle),
    textStyle: {
      ...translateFontName(figmaStyle.fontName),
      fontFamily: figmaStyle.fontName.family,
      fontSize: figmaStyle.fontSize.toString(),
      fontStyle: translateFontStyle(figmaStyle),
      textDecoration: translateTextDecoration(figmaStyle),
      letterSpacing: translateLetterSpacing(figmaStyle),
      textTransform: translateTextTransform(figmaStyle),
      lineHeight: translateLineHeight(figmaStyle)
    },
    typography: {
      path: translateStylePath(figmaStyle),
      name: translateStyleName(figmaStyle)
    }
  };
};
