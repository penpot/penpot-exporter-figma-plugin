import { beforeEach, describe, expect, it, vi } from 'vitest';

import { styleTokenNames } from '@plugin/libraries';
import { translateAppliedStyleTokens } from '@plugin/translators/translateAppliedTokens';

describe('translateAppliedStyleTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    styleTokenNames.clear();
  });

  it('returns empty object when node has no style IDs', () => {
    const node = { type: 'RECTANGLE' } as unknown as SceneNode;

    const result = translateAppliedStyleTokens(node);

    expect(result).toEqual({});
  });

  it('maps effectStyleId to shadow token', () => {
    styleTokenNames.set('S:effect-1', 'Shadow.primary');

    const node = {
      type: 'RECTANGLE',
      effectStyleId: 'S:effect-1'
    } as unknown as SceneNode;

    const result = translateAppliedStyleTokens(node);

    expect(result).toEqual({ shadow: 'Shadow.primary' });
  });

  it('ignores effectStyleId when not in styleTokenNames', () => {
    const node = {
      type: 'RECTANGLE',
      effectStyleId: 'S:unknown'
    } as unknown as SceneNode;

    const result = translateAppliedStyleTokens(node);

    expect(result).toEqual({});
  });

  it('ignores empty effectStyleId', () => {
    styleTokenNames.set('S:effect-1', 'Shadow.primary');

    const node = {
      type: 'RECTANGLE',
      effectStyleId: ''
    } as unknown as SceneNode;

    const result = translateAppliedStyleTokens(node);

    expect(result).toEqual({});
  });
});
