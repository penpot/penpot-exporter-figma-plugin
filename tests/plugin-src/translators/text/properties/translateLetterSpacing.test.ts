import { describe, expect, it } from 'vitest';

import { translateLetterSpacing } from '@plugin/translators/text/properties/translateLetterSpacing';

type Segment = Pick<StyledTextSegment, 'letterSpacing' | 'fontSize'>;

const createSegment = (overrides: Partial<Segment> = {}): Segment =>
  ({
    fontSize: 16,
    letterSpacing: { unit: 'PIXELS', value: 2 },
    ...overrides
  }) as Segment;

describe('translateLetterSpacing', () => {
  it('should return pixel value as string for PIXELS unit', () => {
    const segment = createSegment({ letterSpacing: { unit: 'PIXELS', value: 2 } });

    expect(translateLetterSpacing(segment)).toBe('2');
  });

  it('should calculate percent value based on fontSize', () => {
    const segment = createSegment({
      fontSize: 16,
      letterSpacing: { unit: 'PERCENT', value: 50 }
    });

    expect(translateLetterSpacing(segment)).toBe('8');
  });

  it('should return 0 for undefined letterSpacing', () => {
    const segment = createSegment({ letterSpacing: undefined as unknown as LetterSpacing });

    expect(translateLetterSpacing(segment)).toBe('0');
  });

  it('should return 0 for unknown unit', () => {
    const segment = createSegment({
      letterSpacing: { unit: 'UNKNOWN' as LetterSpacing['unit'], value: 5 }
    });

    expect(translateLetterSpacing(segment)).toBe('0');
  });

  it('should return 0 for PERCENT when fontSize is undefined', () => {
    const segment = createSegment({
      fontSize: undefined as unknown as number,
      letterSpacing: { unit: 'PERCENT', value: 50 }
    });

    expect(translateLetterSpacing(segment)).toBe('0');
  });

  it('should return 0 for PERCENT when fontSize is 0', () => {
    const segment = createSegment({
      fontSize: 0,
      letterSpacing: { unit: 'PERCENT', value: 50 }
    });

    expect(translateLetterSpacing(segment)).toBe('0');
  });
});
