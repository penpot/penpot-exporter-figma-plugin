import fonts from '@plugin/localFonts.json';

import { LocalFont } from '@ui/lib/types/utils/localFont';

export const loadLocalFonts = (): LocalFont[] => {
  return fonts;
};
