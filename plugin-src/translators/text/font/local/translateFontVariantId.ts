import type { LocalFont } from '@plugin/translators/text/font/local/localFont';

export const translateFontVariantId = (
  localFont: LocalFont,
  fontName: FontName,
  fontWeight: string
): string => {
  // check match by style and weight
  const italic = fontName.style.toLowerCase().includes('italic');
  const variantWithStyleWeight = localFont.variants?.find(
    variant => variant.weight === fontWeight && variant.style === (italic ? 'italic' : 'normal')
  );

  if (variantWithStyleWeight !== undefined) return variantWithStyleWeight.id;

  // check match directly by suffix if exists
  const variant = localFont.variants?.find(
    variant => variant.suffix === fontName.style.toLowerCase().replace(/\s/g, '')
  );

  if (variant !== undefined) return variant.id;

  // check match directly by id
  const variantById = localFont.variants?.find(
    variant => variant.id === fontName.style.toLowerCase().replace(/\s/g, '')
  );

  if (variantById !== undefined) return variantById.id;

  // fallback to font weight (it will not be displayed on Penpot, but it will be rendered)
  return fontWeight;
};
