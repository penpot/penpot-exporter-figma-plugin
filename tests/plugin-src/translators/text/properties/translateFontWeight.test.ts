import { describe, expect, it } from 'vitest';

import { translateFontWeight } from '@plugin/translators/text/properties/translateFontWeight';

const fontName = (style: string): FontName => ({ family: 'Noto Serif', style });

describe('translateFontWeight', () => {
  it('should default to 400 when there is no font name', () => {
    expect(translateFontWeight(undefined)).toBe('400');
  });

  it.each([
    ['Thin', '100'],
    ['Extra Light', '200'],
    ['ExtraLight Italic', '200'],
    ['Light', '300'],
    ['Regular', '400'],
    ['Italic', '400'],
    ['Medium', '500'],
    ['Semi Bold', '600'],
    ['SemiBold Italic', '600'],
    ['Bold', '700'],
    ['Extra Bold', '800'],
    ['ExtraBold Italic', '800'],
    ['Black', '900']
  ])('should translate %s to %s', (style, weight) => {
    expect(translateFontWeight(fontName(style))).toBe(weight);
  });

  it.each([
    ['Display Bold', '700'],
    ['Display Regular', '400'],
    ['Condensed Light Italic', '300'],
    ['SemiCondensed SemiBold', '600'],
    ['ExtraCondensed ExtraBold', '800'],
    ['Bold Condensed', '700']
  ])('should find the weight inside a prefixed style %s', (style, weight) => {
    expect(translateFontWeight(fontName(style))).toBe(weight);
  });

  it('should default to 400 for unknown styles', () => {
    expect(translateFontWeight(fontName('Display'))).toBe('400');
  });
});
