import { describe, expect, it } from 'vitest';

import { multiplyMatrix } from '@plugin/utils/multiplyMatrix';

const IDENTITY: Transform = [
  [1, 0, 0],
  [0, 1, 0]
];

describe('multiplyMatrix', () => {
  it('returns identity * m === m', () => {
    const m: Transform = [
      [2, 0, 10],
      [0, 3, 20]
    ];
    expect(multiplyMatrix(IDENTITY, m)).toEqual(m);
    expect(multiplyMatrix(m, IDENTITY)).toEqual(m);
  });

  it('composes translate * translate by adding offsets', () => {
    const a: Transform = [
      [1, 0, 10],
      [0, 1, 20]
    ];
    const b: Transform = [
      [1, 0, 5],
      [0, 1, 7]
    ];
    expect(multiplyMatrix(a, b)).toEqual([
      [1, 0, 15],
      [0, 1, 27]
    ]);
  });

  it('composes scale * scale by multiplying factors', () => {
    const a: Transform = [
      [2, 0, 0],
      [0, 3, 0]
    ];
    const b: Transform = [
      [4, 0, 0],
      [0, 5, 0]
    ];
    expect(multiplyMatrix(a, b)).toEqual([
      [8, 0, 0],
      [0, 15, 0]
    ]);
  });

  it('applies b first then a per `result * p === a * (b * p)`', () => {
    // a: rotate 90° around origin, b: translate (10, 0). Applied to point (1, 0):
    // b first → (11, 0); then a → (0, 11).
    const a: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const b: Transform = [
      [1, 0, 10],
      [0, 1, 0]
    ];
    const composed = multiplyMatrix(a, b);
    const px = composed[0][0] * 1 + composed[0][1] * 0 + composed[0][2];
    const py = composed[1][0] * 1 + composed[1][1] * 0 + composed[1][2];
    expect(px).toBeCloseTo(0);
    expect(py).toBeCloseTo(11);
  });
});
