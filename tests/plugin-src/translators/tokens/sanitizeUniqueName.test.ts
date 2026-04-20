import { beforeEach, describe, expect, it } from 'vitest';

import { uniqueVariableNames } from '@plugin/libraries';
import { sanitizeUniqueName } from '@plugin/translators/tokens/sanitizeUniqueName';

describe('sanitizeUniqueName', () => {
  beforeEach(() => {
    uniqueVariableNames.clear();
  });

  it('replaces / with .', () => {
    expect(sanitizeUniqueName('Brand/Primary')).toBe('Brand.Primary');
  });

  it('strips invalid characters', () => {
    expect(sanitizeUniqueName('Color @#!')).toBe('Color');
  });

  it('handles empty name after sanitization', () => {
    expect(sanitizeUniqueName('@#!')).toBe('unnamed');
  });

  it('ensures uniqueness with incrementing suffix', () => {
    const first = sanitizeUniqueName('Color');
    const second = sanitizeUniqueName('Color');
    const third = sanitizeUniqueName('Color');

    expect(first).toBe('Color');
    expect(second).toBe('Color-1');
    expect(third).toBe('Color-2');
  });

  it('shares the uniqueness pool with pre-registered names', () => {
    uniqueVariableNames.add('Brand.Primary');

    const result = sanitizeUniqueName('Brand/Primary');

    expect(result).toBe('Brand.Primary-1');
  });

  it('handles leading $ by replacing with S', () => {
    expect(sanitizeUniqueName('$token')).toBe('Stoken');
  });

  it('handles leading . by replacing with D', () => {
    expect(sanitizeUniqueName('.hidden')).toBe('Dhidden');
  });

  it('handles trailing . by replacing with D', () => {
    expect(sanitizeUniqueName('trailing.')).toBe('trailingD');
  });

  it('collapses consecutive dots', () => {
    expect(sanitizeUniqueName('a//b')).toBe('a.b');
  });

  it('handles deeply nested paths', () => {
    expect(sanitizeUniqueName('a/b/c/d')).toBe('a.b.c.d');
  });
});
