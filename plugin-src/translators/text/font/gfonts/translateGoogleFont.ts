import { LRUCache } from 'lru-cache';
import slugify from 'slugify';

import { translateFontVariantId } from '@plugin/translators/text/font/gfonts';

import { FontId } from '@ui/lib/types/shapes/textShape';

import { items as gfonts } from './gfonts.json';
import { GoogleFont } from './googleFont';

const empty: unique symbol = Symbol('noValue');
const cache = new LRUCache<string, GoogleFont | typeof empty>({ max: 30 });

export const translateGoogleFont = (fontName: FontName, fontWeight: number): FontId | undefined => {
  const googleFont = getGoogleFont(fontName);

  if (googleFont === undefined) return;

  return {
    fontId: `gfont-${slugify(fontName.family.toLowerCase())}`,
    fontVariantId: translateFontVariantId(googleFont, fontName, fontWeight)
  };
};

export const isGoogleFont = (fontName: FontName): boolean => {
  return getGoogleFont(fontName) !== undefined;
};

const getGoogleFont = (fontName: FontName): GoogleFont | undefined => {
  if (cache.has(fontName.family)) {
    const foo = cache.get(fontName.family);

    return foo === empty ? undefined : foo;
  }

  const googleFont = gfonts.find(font => font.family === fontName.family);

  cache.set(fontName.family, googleFont ?? empty);

  return googleFont;
};
