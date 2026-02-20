import type { GoogleFont } from '@plugin/translators/text/font/gfonts/googleFont';

export const translateFontVariantId = (
  googleFont: GoogleFont,
  fontName: FontName,
  fontWeight: string
): string => {
  const style = fontName.style?.toLowerCase();

  // check match directly by style
  const variant = style ? googleFont.variants?.find(variant => variant === style) : undefined;

  if (variant !== undefined) return variant;

  // check match by style and weight
  const italic = style?.includes('italic') ? 'italic' : '';
  const variantWithWeight = googleFont.variants?.find(
    variant => variant === `${fontWeight}${italic}`
  );

  if (variantWithWeight !== undefined) return variantWithWeight;

  // fallback to font weight (it will not be displayed on Penpot, but it will be rendered)
  return fontWeight;
};
