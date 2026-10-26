import { describe, expect, it } from 'vitest';

import { transformConstraints } from '@plugin/transformers/partials/transformConstraints';

describe('transformConstraints', () => {
  it('translates the node constraints', () => {
    const node = { constraints: { horizontal: 'STRETCH', vertical: 'CENTER' } } as ConstraintMixin;

    expect(transformConstraints(node)).toEqual({
      constraintsH: 'leftright',
      constraintsV: 'center'
    });
  });

  it('returns no constraints when Figma does not expose them', () => {
    // Component sets inside an auto layout frame report undefined constraints
    const node = { constraints: undefined } as unknown as ConstraintMixin;

    expect(transformConstraints(node)).toEqual({});
  });
});
