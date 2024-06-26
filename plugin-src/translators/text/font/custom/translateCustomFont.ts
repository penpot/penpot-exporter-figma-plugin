import { getCustomFontId, translateFontVariantId } from '@plugin/translators/text/font/custom';

import { TextTypography } from '@ui/lib/types/shapes/textShape';

export const translateCustomFont = (
  fontName: FontName,
  fontWeight: string
): Pick<TextTypography, 'fontId' | 'fontVariantId' | 'fontWeight'> | undefined => {
  const customFontId = getCustomFontId(fontName);

  return {
    fontId: customFontId ? `custom-${customFontId}` : '',
    fontVariantId: translateFontVariantId(fontName, fontWeight),
    fontWeight
  };
};
