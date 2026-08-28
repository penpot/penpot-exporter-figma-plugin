import { afterEach, describe, expect, it } from 'vitest';

import {
  hasFigmaPlatformCorruption,
  isFigmaPlatformFailure,
  resetFigmaPlatformCorruption
} from '@plugin/utils';

afterEach((): void => {
  resetFigmaPlatformCorruption();
});

describe('isFigmaPlatformFailure', () => {
  it('recognizes a known signature and marks corruption', () => {
    expect(
      isFigmaPlatformFailure(
        new Error('Property "gridItemsPositioning" failed validation: Required value missing')
      )
    ).toBe(true);
    expect(hasFigmaPlatformCorruption()).toBe(true);
  });

  it('does not treat a generic error as a platform failure before corruption is detected', () => {
    expect(isFigmaPlatformFailure(new Error('boom'))).toBe(false);
    expect(hasFigmaPlatformCorruption()).toBe(false);
  });

  it('treats generic errors as platform failures after corruption is detected', () => {
    isFigmaPlatformFailure(new Error('Attempted to invoke callback with invalid id -32408'));

    expect(isFigmaPlatformFailure(new Error('boom'))).toBe(true);
  });

  it('resets detected corruption', () => {
    isFigmaPlatformFailure(new Error('Attempted to invoke callback with invalid id -32408'));
    resetFigmaPlatformCorruption();

    expect(hasFigmaPlatformCorruption()).toBe(false);
  });
});
