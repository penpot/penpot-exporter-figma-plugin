import { GoogleFont } from './googleFont';

export const translateFontVariantId = (
  googleFont: GoogleFont,
  fontName: FontName,
  fontWeight: number
) => {
  // check match directly by style
  const variant = googleFont.variants?.find(variant => variant === fontName.style.toLowerCase());

  if (variant !== undefined) return variant;

  // check match by style and weight
  const italic = fontName.style.toLowerCase().includes('italic') ? 'italic' : '';
  const variantWithWeight = googleFont.variants?.find(
    variant => variant === `${fontWeight.toString()}${italic}`
  );

  if (variantWithWeight !== undefined) return variantWithWeight;
};
