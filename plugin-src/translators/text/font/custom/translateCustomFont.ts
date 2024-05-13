import { getCustomFontId, translateFontVariantId } from '@plugin/translators/text/font/custom';

import { FontId } from '@ui/lib/types/shapes/textShape';

export const translateCustomFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  return {
    fontId: `custom-${getCustomFontId(fontName)}`,
    fontVariantId: translateFontVariantId(fontName, fontWeight)
  };
};
