import { describe, expect, it } from 'vitest';

import { translateFontName } from '@plugin/translators/text/font';
import { translateFontWeight } from '@plugin/translators/text/properties/translateFontWeight';

const fontName = (style: string, family = 'SF Pro'): FontName => ({ family, style });

describe('translateFontWeight', () => {
  it('returns 400 when there is no font name', () => {
    expect(translateFontWeight(undefined)).toBe('400');
  });

  it.each([
    ['Thin', '100'],
    ['ExtraLight Italic', '200'],
    ['Light', '300'],
    ['Regular', '400'],
    ['Italic', '400'],
    ['Medium Italic', '500'],
    ['Semi Bold', '600'],
    ['SemiBold Italic', '600'],
    ['Bold', '700'],
    ['Extra Bold', '800'],
    ['Black Italic', '900']
  ])('maps the %s style to %s', (style, weight) => {
    expect(translateFontWeight(fontName(style))).toBe(weight);
  });

  it.each([
    ['Ultralight', '200'],
    ['UltraLight', '200'],
    ['Semibold', '600'],
    ['Semibold Italic', '600'],
    ['Extrabold', '800'],
    ['Heavy', '900'],
    ['Heavy Italic', '900']
  ])('maps the %s style to %s regardless of spelling', (style, weight) => {
    expect(translateFontWeight(fontName(style))).toBe(weight);
  });

  it('exports an SF Pro Semibold text as weight 600', () => {
    expect(translateFontName(fontName('Semibold'))).toEqual({
      fontId: '',
      fontVariantId: 'normal-600',
      fontWeight: '600'
    });
  });
});
