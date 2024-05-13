export const translateFontVariantId = (fontName: FontName, fontWeight: number) => {
  const style = fontName.style.toLowerCase().includes('italic') ? 'italic' : 'normal';

  return `${style}-${fontWeight.toString()}`;
};
