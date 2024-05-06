const customFontIds = new Map<string, string>();

export const getCustomFontId = (fontName: FontName) => {
  return customFontIds.get(fontName.family);
};

export const setCustomFontId = (fontFamily: string, fontId: string) => {
  customFontIds.set(fontFamily, fontId);
};
