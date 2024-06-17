import { getCustomFontId, translateFontVariantId } from '@plugin/translators/text/font/custom';

import { FontId } from '@ui/lib/types/shapes/textShape';

export const translateCustomFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  return {
    'font-id': `custom-${getCustomFontId(fontName)}`,
    'font-variant-id': translateFontVariantId(fontName, fontWeight)
  };
};
