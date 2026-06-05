import { describe, expect, it } from 'vitest';

import { finiteOrUndefined } from '@plugin/utils';

describe('finiteOrUndefined', () => {
  it('returns finite numbers unchanged', () => {
    expect(finiteOrUndefined(0)).toBe(0);
    expect(finiteOrUndefined(51)).toBe(51);
    expect(finiteOrUndefined(-3.5)).toBe(-3.5);
  });

  it('returns undefined for NaN', () => {
    expect(finiteOrUndefined(NaN)).toBeUndefined();
  });

  it('returns undefined for Infinity and -Infinity', () => {
    expect(finiteOrUndefined(Infinity)).toBeUndefined();
    expect(finiteOrUndefined(-Infinity)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(finiteOrUndefined(undefined)).toBeUndefined();
  });
});
