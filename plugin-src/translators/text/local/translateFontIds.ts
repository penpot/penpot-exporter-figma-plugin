import { items as localFonts } from '@plugin/localFonts.json';

export const isLocalFont = (fontName: FontName): boolean => {
  return findLocalFont(fontName) !== undefined;
};

export const translateFontId = (fontName: FontName): string => {
  const localFont = findLocalFont(fontName);

  return localFont?.family ?? '';
};

export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
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

const findLocalFont = (fontName: FontName) => {
  return localFonts.find(localFont => localFont.name === fontName.family);
};
