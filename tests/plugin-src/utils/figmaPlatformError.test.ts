import { describe, expect, it } from 'vitest';

import { isFigmaPlatformError } from '@plugin/utils/figmaPlatformError';

describe('isFigmaPlatformError', () => {
  it('recognizes the callback ID signature', () => {
    expect(
      isFigmaPlatformError(
        new Error('in <unknown>: Attempted to invoke callback with invalid id -32408')
      )
    ).toBe(true);
  });

  it('recognizes the virtual node property signature', () => {
    expect(
      isFigmaPlatformError(
        new Error(
          'in get_componentPropertyReferences: Expected node id to be a string, got undefined'
        )
      )
    ).toBe(true);
  });

  it('recognizes the grid item positioning signature from non-Error values', () => {
    expect(
      isFigmaPlatformError(
        'Property "gridItemsPositioning" failed validation: Required value missing'
      )
    ).toBe(true);
  });
});
