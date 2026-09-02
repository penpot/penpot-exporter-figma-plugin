import { describe, expect, it } from 'vitest';

import { translateGridTracks } from '@plugin/translators/translateLayout';
import { FigmaPlatformDataError } from '@plugin/utils/figmaPlatformError';

describe('translateGridTracks', () => {
  it('translates flex and fixed grid tracks', () => {
    expect(
      translateGridTracks([
        { type: 'FLEX', value: 1 },
        { type: 'FIXED', value: 100 }
      ])
    ).toEqual([
      { type: 'flex', value: 1 },
      { type: 'fixed', value: 100 }
    ]);
  });

  it('throws a platform data error for undefined tracks', () => {
    expect(() => translateGridTracks([undefined as unknown as GridTrackSize])).toThrow(
      FigmaPlatformDataError
    );
  });

  it('throws a platform data error for tracks without numeric values', () => {
    expect(() => translateGridTracks([{ type: 'FLEX' } as GridTrackSize])).toThrow(
      FigmaPlatformDataError
    );
  });
});
