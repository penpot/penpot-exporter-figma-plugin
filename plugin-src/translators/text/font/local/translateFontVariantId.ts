import type { LocalFont } from '@plugin/translators/text/font/local/localFont';

export const translateFontVariantId = (
  localFont: LocalFont,
  fontName: FontName,
  fontWeight: string
): string => {
  const style = fontName.style?.toLowerCase();

  // check match by style and weight
  const italic = style?.includes('italic') ?? false;
  const variantWithStyleWeight = localFont.variants?.find(
    variant => variant.weight === fontWeight && variant.style === (italic ? 'italic' : 'normal')
  );

  if (variantWithStyleWeight !== undefined) return variantWithStyleWeight.id;

  // check match directly by suffix if exists
  const normalizedStyle = style?.replace(/\s/g, '');
  const variant = normalizedStyle
    ? localFont.variants?.find(variant => variant.suffix === normalizedStyle)
    : undefined;

  if (variant !== undefined) return variant.id;

  // check match directly by id
  const variantById = normalizedStyle
    ? localFont.variants?.find(variant => variant.id === normalizedStyle)
    : undefined;

  if (variantById !== undefined) return variantById.id;

  // fallback to font weight (it will not be displayed on Penpot, but it will be rendered)
  return fontWeight;
};
