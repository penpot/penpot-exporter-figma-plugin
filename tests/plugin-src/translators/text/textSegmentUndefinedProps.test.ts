import { describe, expect, it, vi } from 'vitest';

import type { TextSegment } from '@plugin/translators/text/paragraph';
import { translateLetterSpacing } from '@plugin/translators/text/properties/translateLetterSpacing';
import { translateLineHeight } from '@plugin/translators/text/properties/translateLineHeight';
import { transformTextStyle } from '@plugin/translators/text/translateTextSegments';

vi.mock('@plugin/libraries', () => ({
  textStyles: new Map()
}));

vi.mock('@plugin/transformers/partials', () => ({
  transformFills: (): { fills: never[] } => ({ fills: [] })
}));

vi.mock('@plugin/translators/text/font', () => ({
  translateFontName: (): Record<string, string> => ({
    fontId: 'gfont-inter',
    fontVariantId: 'regular',
    fontWeight: '400'
  })
}));

const createTextNode = (): TextNode =>
  ({
    textAlignHorizontal: 'LEFT'
  }) as unknown as TextNode;

const createSegment = (overrides: Partial<TextSegment> = {}): TextSegment =>
  ({
    characters: 'hello',
    start: 0,
    end: 5,
    fontName: { family: 'Inter', style: 'Regular' },
    fontSize: 16,
    fontWeight: 400,
    lineHeight: { unit: 'AUTO', value: 0 },
    letterSpacing: { unit: 'PIXELS', value: 0 },
    textCase: 'ORIGINAL',
    textDecoration: 'NONE',
    indentation: 0,
    listOptions: { type: 'NONE' },
    fills: [],
    fillStyleId: '',
    textStyleId: '',
    ...overrides
  }) as unknown as TextSegment;

describe('text segment with undefined properties', () => {
  it('handles undefined fontName without crashing', () => {
    const node = createTextNode();
    const segment = createSegment({ fontName: undefined as unknown as FontName });

    expect(() => transformTextStyle(node, segment)).not.toThrow();

    const result = transformTextStyle(node, segment);
    expect(result.fontFamily).toBe('sourcesanspro');
    expect(result.fontStyle).toBe('normal');
    expect(result.fontId).toBe('gfont-inter');
    expect(result.fontVariantId).toBe('regular');
    expect(result.fontWeight).toBe('400');
  });

  it('handles undefined fontSize without crashing', () => {
    const node = createTextNode();
    const segment = createSegment({ fontSize: undefined as unknown as number });

    expect(() => transformTextStyle(node, segment)).not.toThrow();

    const result = transformTextStyle(node, segment);
    expect(result.fontSize).toBe('14');
  });

  it('handles undefined letterSpacing without crashing', () => {
    const segment = { letterSpacing: undefined, fontSize: 16 } as unknown as Pick<
      StyledTextSegment,
      'letterSpacing' | 'fontSize'
    >;

    expect(() => translateLetterSpacing(segment)).not.toThrow();
    expect(translateLetterSpacing(segment)).toBe('0');
  });

  it('handles undefined lineHeight without crashing', () => {
    const segment = { lineHeight: undefined, fontSize: 16 } as unknown as Pick<
      StyledTextSegment,
      'lineHeight' | 'fontSize'
    >;

    expect(() => translateLineHeight(segment)).not.toThrow();
    expect(translateLineHeight(segment)).toBe('1.2');
  });

  it('handles all properties undefined at once without crashing', () => {
    const node = createTextNode();
    const segment = createSegment({
      fontName: undefined as unknown as FontName,
      fontSize: undefined as unknown as number,
      letterSpacing: undefined as unknown as LetterSpacing,
      lineHeight: undefined as unknown as LineHeight
    });

    expect(() => transformTextStyle(node, segment)).not.toThrow();
  });
});
