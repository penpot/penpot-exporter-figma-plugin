import { describe, expect, it } from 'vitest';

import { isBenignWindowError } from '@ui/utils/isBenignWindowError';

describe('isBenignWindowError', () => {
  it('ignores the ResizeObserver undelivered notifications warning', () => {
    expect(
      isBenignWindowError('ResizeObserver loop completed with undelivered notifications.')
    ).toBe(true);
  });

  it('ignores the legacy ResizeObserver loop limit warning', () => {
    expect(isBenignWindowError('ResizeObserver loop limit exceeded')).toBe(true);
  });

  it('keeps real errors', () => {
    expect(isBenignWindowError('out of memory')).toBe(false);
    expect(isBenignWindowError('The source image could not be decoded.')).toBe(false);
  });

  it('keeps errors without a message', () => {
    expect(isBenignWindowError(undefined)).toBe(false);
    expect(isBenignWindowError('')).toBe(false);
  });
});
