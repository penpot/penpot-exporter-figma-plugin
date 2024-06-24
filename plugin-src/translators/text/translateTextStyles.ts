import {
  translateFontStyle,
  translateLetterSpacing,
  translateLineHeight,
  translateTextDecoration,
  translateTextTransform
} from '@plugin/translators/text/properties';

import { TypographyStyle } from '@ui/lib/types/shapes/textShape';

export const translateTextStyles = (figmaStyle: TextStyle): TypographyStyle => {
  const typographyStyle: TypographyStyle = {
    name: figmaStyle.name,
    textStyle: {},
    typography: {}
  };

  const path = figmaStyle.remote ? 'Remote / ' : '';

  const lineHeight = translateLineHeight(figmaStyle);

  typographyStyle.textStyle = {
    fontFamily: figmaStyle.fontName.family,
    fontSize: figmaStyle.fontSize.toString(),
    fontStyle: translateFontStyle(figmaStyle.fontName.style),
    textDecoration: translateTextDecoration(figmaStyle),
    letterSpacing: translateLetterSpacing(figmaStyle),
    textTransform: translateTextTransform(figmaStyle),
    ...(lineHeight ? { lineHeight } : {})
  };
  typographyStyle.typography = {
    path,
    name: figmaStyle.name
  };

  return typographyStyle;
};
