export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
  // check match by style and weight
  const italic = fontName.style.toLowerCase().includes('italic') ? 'italic' : 'normal';
  return `${italic}-${fontWeight.toString()}`;
};
