import { LocalFont } from './localFont';

export const translateFontVariantId = (
  localFont: LocalFont,
  fontName: FontName,
  fontWeight: number
): string | undefined => {
  // check match by style and weight
  const italic = fontName.style.toLowerCase().includes('italic');
  const variantWithStyleWeight = localFont.variants?.find(
    variant =>
      variant.weight === fontWeight.toString() && variant.style === (italic ? 'italic' : 'normal')
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
};
