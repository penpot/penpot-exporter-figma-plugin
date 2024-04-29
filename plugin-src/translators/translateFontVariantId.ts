import { loadGoogleFonts } from '@plugin/utils';

import { Gfont } from '@ui/lib/types/utils/gfont';

export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
  // Gfont
  const variantId = translateGfontVariantId(fontName, fontWeight);
  if (variantId !== undefined) {
    return variantId;
  }

  // @TODO: Custom font
  // @TODO: Source Sans pro
  return fontName.style.toLowerCase().replace(/\s/g, '');
};

const getGfont = (fontFamily: string): Gfont | undefined => {
  return loadGoogleFonts().find(gfont => gfont.family === fontFamily);
};

const translateGfontVariantId = (fontName: FontName, fontWeight: number): string | undefined => {
  const gfont = getGfont(fontName.family);
  if (gfont === undefined) {
    return;
  }

  // check match directly by style
  const variant = gfont.variants.find(variant => variant === fontName.style.toLowerCase());
  if (variant !== undefined) {
    return variant;
  }

  // check match by style and weight
  const italic = fontName.style.toLowerCase().includes('italic') ? 'italic' : '';
  const variantWithWeight = gfont.variants.find(
    variant => variant === `${fontWeight.toString()}${italic}`
  );
  if (variantWithWeight !== undefined) {
    return variantWithWeight;
  }
};
