import slugify from 'slugify';

import fonts from '../gfonts.json';

const gfonts = new Set(fonts);

export const validateFont = (fontName: FontName): boolean => {
  const name = slugify(fontName.family.toLowerCase());
  return gfonts.has(name);
};
