import { describe, expect, it } from 'vitest';

import type { LocalFont } from '@plugin/translators/text/font/local/localFont';
import { translateFontVariantId } from '@plugin/translators/text/font/local/translateFontVariantId';

const createLocalFont = (variants?: LocalFont['variants']): LocalFont => ({
  id: 'local-inter',
  name: 'Inter',
  family: 'Inter',
  variants
});

describe('local translateFontVariantId', () => {
  it('should match by style and weight', () => {
    const font = createLocalFont([
      { id: 'regular', name: 'Regular', weight: '400', style: 'normal' },
      { id: 'italic', name: 'Italic', weight: '400', style: 'italic' }
    ]);
    const fontName = { family: 'Inter', style: 'Regular' } as FontName;

    expect(translateFontVariantId(font, fontName, '400')).toBe('regular');
  });

  it('should match italic by style and weight', () => {
    const font = createLocalFont([
      { id: 'regular', name: 'Regular', weight: '400', style: 'normal' },
      { id: 'italic', name: 'Italic', weight: '400', style: 'italic' }
    ]);
    const fontName = { family: 'Inter', style: 'Italic' } as FontName;

    expect(translateFontVariantId(font, fontName, '400')).toBe('italic');
  });

  it('should match by suffix', () => {
    const font = createLocalFont([
      { id: 'bold', name: 'Bold', weight: '700', style: 'normal', suffix: 'bold' }
    ]);
    const fontName = { family: 'Inter', style: 'Bold' } as FontName;

    expect(translateFontVariantId(font, fontName, '700')).toBe('bold');
  });

  it('should match by id when suffix does not match', () => {
    const font = createLocalFont([
      { id: 'semibold', name: 'SemiBold', weight: '600', style: 'normal', suffix: 'other' }
    ]);
    const fontName = { family: 'Inter', style: 'Semi Bold' } as FontName;

    expect(translateFontVariantId(font, fontName, '600')).toBe('semibold');
  });

  it('should fallback to fontWeight when no variant matches', () => {
    const font = createLocalFont([
      { id: 'regular', name: 'Regular', weight: '400', style: 'normal' }
    ]);
    const fontName = { family: 'Inter', style: 'ExtraBold' } as FontName;

    expect(translateFontVariantId(font, fontName, '800')).toBe('800');
  });

  it('should handle undefined fontName.style without crashing', () => {
    const font = createLocalFont([
      { id: 'regular', name: 'Regular', weight: '400', style: 'normal' }
    ]);
    const fontName = { family: 'Inter', style: undefined } as unknown as FontName;

    expect(() => translateFontVariantId(font, fontName, '400')).not.toThrow();
    // defaults to non-italic, matches normal style variant by weight
    expect(translateFontVariantId(font, fontName, '400')).toBe('regular');
  });

  it('should handle undefined variants without crashing', () => {
    const font = createLocalFont(undefined);
    const fontName = { family: 'Inter', style: 'Regular' } as FontName;

    expect(translateFontVariantId(font, fontName, '400')).toBe('400');
  });
});
