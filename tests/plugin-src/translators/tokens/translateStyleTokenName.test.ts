import { beforeEach, describe, expect, it } from 'vitest';

import { uniqueVariableNames } from '@plugin/libraries';
import { translateStyleTokenName } from '@plugin/translators/tokens/translateStyleTokenName';

describe('translateStyleTokenName', () => {
  beforeEach(() => {
    uniqueVariableNames.clear();
  });

  it('replaces / with .', () => {
    expect(translateStyleTokenName('Brand/Primary')).toBe('Brand.Primary');
  });

  it('strips invalid characters', () => {
    expect(translateStyleTokenName('Color @#!')).toBe('Color');
  });

  it('handles empty name after sanitization', () => {
    expect(translateStyleTokenName('@#!')).toBe('unnamed');
  });

  it('ensures uniqueness with incrementing suffix', () => {
    const first = translateStyleTokenName('Color');
    const second = translateStyleTokenName('Color');
    const third = translateStyleTokenName('Color');

    expect(first).toBe('Color');
    expect(second).toBe('Color-1');
    expect(third).toBe('Color-2');
  });

  it('shares uniqueness pool with variables', () => {
    uniqueVariableNames.add('Brand.Primary');

    const result = translateStyleTokenName('Brand/Primary');

    expect(result).toBe('Brand.Primary-1');
  });

  it('handles leading $ by replacing with S', () => {
    expect(translateStyleTokenName('$token')).toBe('Stoken');
  });

  it('handles leading . by replacing with D', () => {
    expect(translateStyleTokenName('.hidden')).toBe('Dhidden');
  });

  it('handles trailing . by replacing with D', () => {
    expect(translateStyleTokenName('trailingD')).toBe('trailingD');
  });

  it('collapses consecutive dots', () => {
    expect(translateStyleTokenName('a//b')).toBe('a.b');
  });

  it('handles deeply nested paths', () => {
    expect(translateStyleTokenName('a/b/c/d')).toBe('a.b.c.d');
  });
});
