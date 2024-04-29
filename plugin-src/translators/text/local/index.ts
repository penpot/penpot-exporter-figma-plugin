import { isLocalFont, translateFontId, translateFontVariantId } from './translateFontIds';

export const findLocalFont = (
  fontName: FontName,
  fontWeight: number
):
  | {
      fontId: string;
      fontVariantId: string | undefined;
    }
  | undefined => {
  if (isLocalFont(fontName)) {
    return {
      fontId: translateFontId(fontName),
      fontVariantId: translateFontVariantId(fontName, fontWeight)
    };
  }
};
