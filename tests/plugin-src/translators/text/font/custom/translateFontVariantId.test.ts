import { describe, expect, it } from 'vitest';

import { translateFontVariantId } from '@plugin/translators/text/font/custom/translateFontVariantId';

describe('custom translateFontVariantId', () => {
  it('should return italic variant when style contains italic', () => {
    const fontName = { family: 'MyFont', style: 'Bold Italic' } as FontName;

    expect(translateFontVariantId(fontName, '700')).toBe('italic-700');
  });

  it('should return normal variant when style does not contain italic', () => {
    const fontName = { family: 'MyFont', style: 'Regular' } as FontName;

    expect(translateFontVariantId(fontName, '400')).toBe('normal-400');
  });

  it('should return normal variant when fontName is undefined', () => {
    expect(translateFontVariantId(undefined, '400')).toBe('normal-400');
  });

  it('should return normal variant when fontName.style is undefined', () => {
    const fontName = { family: 'MyFont', style: undefined } as unknown as FontName;

    expect(translateFontVariantId(fontName, '400')).toBe('normal-400');
  });
});
