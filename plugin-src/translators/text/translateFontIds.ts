import slugify from 'slugify';

import { items as gfonts } from '@plugin/gfonts.json';

export const translateFontId = (fontName: FontName): string => {
  if (isGfont(fontName)) {
    return `gfont-${slugify(fontName.family.toLowerCase())}`;
  }

  // @TODO: check if source sans pro

  // always send font name if not gfont or source sans pro
  figma.ui.postMessage({ type: 'FONT_NAME', data: fontName.family });

  // @TODO: custom font
  return slugify(fontName.family.toLowerCase());
};

export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
  const variantId = translateGfontVariantId(fontName, fontWeight);
  if (variantId !== undefined) {
    return variantId;
  }

  // @TODO: Custom font
  // @TODO: Source Sans pro
  return fontName.style.toLowerCase().replace(/\s/g, '');
};

const findGoogleFont = (fontName: FontName) => {
  return gfonts.find(font => font.family === fontName.family);
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
