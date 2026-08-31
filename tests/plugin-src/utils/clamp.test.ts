import { describe, expect, it } from 'vitest';

import { clamp } from '@plugin/utils';

describe('clamp', () => {
  it('returns values within the range unchanged', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(51, 0, 100)).toBe(51);
    expect(clamp(-2, -5, 5)).toBe(-2);
  });

  it('returns max for values above the range', () => {
    expect(clamp(100, 0, 1)).toBe(1);
    expect(clamp(1.05, 0, 1)).toBe(1);
  });

  it('returns min for values below the range', () => {
    expect(clamp(-0.5, 0, 1)).toBe(0);
    expect(clamp(-10, -5, 5)).toBe(-5);
  });

  it('returns the exact boundary values unchanged', () => {
    expect(clamp(0, 0, 1)).toBe(0);
    expect(clamp(1, 0, 1)).toBe(1);
  });
});
