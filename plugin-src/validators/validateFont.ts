import slugify from 'slugify';

import fonts from '@plugin/gfonts.json';

const gfonts = new Set(fonts);

export const validateFont = (fontFamily: string): boolean => {
  const name = slugify(fontFamily.toLowerCase());
  return gfonts.has(name);
};
