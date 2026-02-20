import { describe, expect, it } from 'vitest';

import type { GoogleFont } from '@plugin/translators/text/font/gfonts/googleFont';
import { translateFontVariantId } from '@plugin/translators/text/font/gfonts/translateFontVariantId';

const createGoogleFont = (variants?: string[]): GoogleFont => ({
  family: 'Inter',
  variants,
  version: 'v1',
  lastModified: '2024-01-01',
  category: 'sans-serif',
  kind: 'webfonts#webfont',
  menu: ''
});

describe('gfonts translateFontVariantId', () => {
  it('should match variant directly by style', () => {
    const font = createGoogleFont(['regular', 'italic', '700', '700italic']);
    const fontName = { family: 'Inter', style: 'Regular' } as FontName;

    expect(translateFontVariantId(font, fontName, '400')).toBe('regular');
  });

  it('should match variant by weight and italic suffix', () => {
    const font = createGoogleFont(['700italic']);
    const fontName = { family: 'Inter', style: 'Bold Italic' } as FontName;

    expect(translateFontVariantId(font, fontName, '700')).toBe('700italic');
  });

  it('should match variant by weight without italic', () => {
    const font = createGoogleFont(['700']);
    const fontName = { family: 'Inter', style: 'Bold' } as FontName;

    expect(translateFontVariantId(font, fontName, '700')).toBe('700');
  });

  it('should fallback to fontWeight when no variant matches', () => {
    const font = createGoogleFont(['regular']);
    const fontName = { family: 'Inter', style: 'ExtraBold' } as FontName;

    expect(translateFontVariantId(font, fontName, '800')).toBe('800');
  });

  it('should handle undefined fontName.style without crashing', () => {
    const font = createGoogleFont(['regular', '400']);
    const fontName = { family: 'Inter', style: undefined } as unknown as FontName;

    expect(() => translateFontVariantId(font, fontName, '400')).not.toThrow();
    expect(translateFontVariantId(font, fontName, '400')).toBe('400');
  });

  it('should handle undefined variants without crashing', () => {
    const font = createGoogleFont(undefined);
    const fontName = { family: 'Inter', style: 'Regular' } as FontName;

    expect(translateFontVariantId(font, fontName, '400')).toBe('400');
  });
});
