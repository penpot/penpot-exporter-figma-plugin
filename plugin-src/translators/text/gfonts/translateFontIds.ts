import slugify from 'slugify';

import { items as gfonts } from '@plugin/gfonts.json';

export const isGfont = (fontName: FontName): boolean => {
  return findGoogleFont(fontName) !== undefined;
};

export const translateFontId = (fontName: FontName): string => {
  return `gfont-${slugify(fontName.family.toLowerCase())}`;
};

export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
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

const findGoogleFont = (fontName: FontName) => {
  return gfonts.find(font => font.family === fontName.family);
};
