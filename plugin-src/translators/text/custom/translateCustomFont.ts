import slugify from 'slugify';

import { translateFontVariantId } from '@plugin/translators/text/custom';

import { FontId } from '@ui/lib/types/text/textContent';

/**
 * @TODO: implement custom font loading for Penpot
 */
export const translateCustomFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  // For now display a message in the UI, so the user knows
  // that the file is using a custom font not present in Penpot
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  return {
    fontId: slugify(fontName.family.toLowerCase()),
    fontVariantId: translateFontVariantId(fontName, fontWeight)
  };
};
