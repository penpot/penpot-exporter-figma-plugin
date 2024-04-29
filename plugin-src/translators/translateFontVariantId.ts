import { loadGoogleFonts, loadLocalFonts } from '@plugin/utils';

import { Gfont } from '@ui/lib/types/utils/gfont';
import { LocalFont } from '@ui/lib/types/utils/localFont';

export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
  // Gfont
  const googleVariantId = translateGfontVariantId(fontName, fontWeight);
  if (googleVariantId !== undefined) {
    return googleVariantId;
  }

  // local font
  const localVariantId = translateLocalFontVariantId(fontName, fontWeight);
  if (localVariantId !== undefined) {
    return localVariantId;
  }

  // @TODO: Custom font
  return fontName.style.toLowerCase().replace(/\s/g, '');
};

const getGfont = (fontFamily: string): Gfont | undefined => {
  return loadGoogleFonts().find(gfont => gfont.family === fontFamily);
};

const getLocalFont = (fontFamily: string): LocalFont | undefined => {
  return loadLocalFonts().find(localFont => localFont.name === fontFamily);
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

const translateLocalFontVariantId = (
  fontName: FontName,
  fontWeight: number
): string | undefined => {
  const font = getLocalFont(fontName.family);
  if (font === undefined) {
    return;
  }

  // check match by style and weight
  const italic = fontName.style.toLowerCase().includes('italic');
  const variantWithStyleWeight = font.variants?.find(
    variant =>
      variant.weight === fontWeight.toString() && variant.style === (italic ? 'italic' : 'normal')
  );
  if (variantWithStyleWeight !== undefined) {
    return variantWithStyleWeight.id;
  }

  // check match directly by suffix if exists
  const variant = font.variants?.find(
    variant => variant.suffix === fontName.style.toLowerCase().replace(/\s/g, '')
  );
  if (variant !== undefined) {
    return variant.id;
  }

  // check match directly by id
  const variantById = font.variants?.find(
    variant => variant.id === fontName.style.toLowerCase().replace(/\s/g, '')
  );
  if (variantById !== undefined) {
    return variantById.id;
  }
};
