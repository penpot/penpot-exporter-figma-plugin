export const translateFontVariantId = (
  fontName: FontName | undefined,
  fontWeight: string
): string => {
  const style = fontName?.style?.toLowerCase().includes('italic') ? 'italic' : 'normal';

  return `${style}-${fontWeight}`;
};
