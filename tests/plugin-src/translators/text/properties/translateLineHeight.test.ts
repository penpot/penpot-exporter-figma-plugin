import { describe, expect, it } from 'vitest';

import { translateLineHeight } from '@plugin/translators/text/properties/translateLineHeight';

type Segment = Pick<StyledTextSegment, 'lineHeight' | 'fontSize'>;

const createSegment = (overrides: Partial<Segment> = {}): Segment =>
  ({
    fontSize: 16,
    lineHeight: { unit: 'PIXELS', value: 24 },
    ...overrides
  }) as Segment;

describe('translateLineHeight', () => {
  it('should return ratio for PIXELS unit', () => {
    const segment = createSegment({
      fontSize: 16,
      lineHeight: { unit: 'PIXELS', value: 24 }
    });

    expect(translateLineHeight(segment)).toBe('1.5');
  });

  it('should return percentage as decimal for PERCENT unit', () => {
    const segment = createSegment({
      lineHeight: { unit: 'PERCENT', value: 150 }
    });

    expect(translateLineHeight(segment)).toBe('1.5');
  });

  it('should return 1.2 for undefined lineHeight', () => {
    const segment = createSegment({ lineHeight: undefined as unknown as LineHeight });

    expect(translateLineHeight(segment)).toBe('1.2');
  });

  it('should return 1.2 for AUTO unit', () => {
    const segment = createSegment({
      lineHeight: { unit: 'AUTO', value: 0 } as unknown as LineHeight
    });

    expect(translateLineHeight(segment)).toBe('1.2');
  });

  it('should return 1.2 for PIXELS when fontSize is undefined', () => {
    const segment = createSegment({
      fontSize: undefined as unknown as number,
      lineHeight: { unit: 'PIXELS', value: 24 }
    });

    expect(translateLineHeight(segment)).toBe('1.2');
  });

  it('should return 1.2 for PIXELS when fontSize is 0', () => {
    const segment = createSegment({
      fontSize: 0,
      lineHeight: { unit: 'PIXELS', value: 24 }
    });

    expect(translateLineHeight(segment)).toBe('1.2');
  });
});
