import slugify from 'slugify';

import { translateFontVariantId } from '@plugin/translators/text/custom';

import { FontId } from '@ui/lib/types/text/textContent';

/**
 * @TODO: implement custom font loading for Penpot
 */
export const translateCustomFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  return {
    fontId: slugify(fontName.family.toLowerCase()),
    fontVariantId: translateFontVariantId(fontName, fontWeight)
  };
};
