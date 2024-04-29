import slugify from 'slugify';

import { items as gfonts } from '@plugin/gfonts.json';
import { items as localFonts } from '@plugin/localFonts.json';

export const translateFontId = (fontName: FontName): string => {
  if (isGfont(fontName)) {
    return `gfont-${slugify(fontName.family.toLowerCase())}`;
  }

  // is local font
  const localFont = localFonts.find(localFont => localFont.name === fontName.family);
  if (localFont !== undefined) {
    return localFont.family;
  }

  // always send font name if custom font
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  // @TODO: custom font
  return slugify(fontName.family.toLowerCase());
};

export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
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

const findGoogleFont = (fontName: FontName) => {
  return gfonts.find(font => font.family === fontName.family);
};

const findLocalFont = (fontName: FontName) => {
  return localFonts.find(localFont => localFont.name === fontName.family);
};

const isGfont = (fontName: FontName): boolean => {
  return findGoogleFont(fontName) !== undefined;
};

const translateGfontVariantId = (fontName: FontName, fontWeight: number): string | undefined => {
  const gfont = findGoogleFont(fontName);

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
  const font = findLocalFont(fontName);
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
