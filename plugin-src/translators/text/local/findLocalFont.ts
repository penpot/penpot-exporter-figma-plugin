import { items as localFonts } from '@plugin/localFonts.json';
import { translateFontVariantId } from '@plugin/translators/text/local';

import { LocalFont } from '@ui/lib/types/utils/localFont';
import { PenpotFont } from '@ui/lib/types/utils/penpotFont';

export const findLocalFont = (fontName: FontName, fontWeight: number): PenpotFont | undefined => {
  const localFont = getLocalFont(fontName);

  if (localFont !== undefined) {
    return {
      fontId: localFont.id,
      fontVariantId: translateFontVariantId(localFont, fontName, fontWeight)
    };
  }
};

const getLocalFont = (fontName: FontName): LocalFont | undefined => {
  return localFonts.find(localFont => localFont.name === fontName.family);
};
