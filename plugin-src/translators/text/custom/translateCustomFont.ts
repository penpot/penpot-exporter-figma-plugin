import { getCustomFontId, translateFontVariantId } from '@plugin/translators/text/custom';

import { FontId } from '@ui/lib/types/text/textContent';

export const translateCustomFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  return {
    fontId: `custom-${getCustomFontId(fontName)}`,
    fontVariantId: translateFontVariantId(fontName, fontWeight)
  };
};
