import { findCustomFont } from '@plugin/translators/text/custom';

import { PenpotFont } from '@ui/lib/types/utils/penpotFont';

import { findGoogleFont } from './gfonts';
import { findLocalFont } from './local';

export const translateFont = (fontName: FontName, fontWeight: number): PenpotFont | undefined => {
  return (
    findLocalFont(fontName, fontWeight) ??
    findGoogleFont(fontName, fontWeight) ??
    findCustomFont(fontName)
  );
};
