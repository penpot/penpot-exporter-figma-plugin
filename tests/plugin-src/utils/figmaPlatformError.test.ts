import { describe, expect, it } from 'vitest';

import { FigmaPlatformDataError, isFigmaPlatformError } from '@plugin/utils/figmaPlatformError';

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

  it('recognizes the grid item positioning validation signature from non-Error values', () => {
    expect(
      isFigmaPlatformError(
        'Property "gridItemsPositioning" failed validation: Required value missing'
      )
    ).toBe(true);
  });

  it('recognizes component property validation signatures', () => {
    expect(
      isFigmaPlatformError(
        new Error(
          'in set_componentPropertyReferences: Property "node.componentPropertyReferences.value" failed validation: Required value missing'
        )
      )
    ).toBe(true);
  });

  it('recognizes platform data errors', () => {
    expect(isFigmaPlatformError(new FigmaPlatformDataError('x'))).toBe(true);
  });

  it('does not recognize unrelated errors', () => {
    expect(
      isFigmaPlatformError(new TypeError("Cannot read properties of undefined (reading 'value')"))
    ).toBe(false);
  });
});
