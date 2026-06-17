import { describe, expect, it } from 'vitest';

import { asyncPool } from '@common/asyncPool';

describe('asyncPool', () => {
  it('runs the worker for every item', async () => {
    const processed: number[] = [];

    await asyncPool(2, [1, 2, 3, 4, 5], async item => {
      processed.push(item);
    });

    expect(processed.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });

  it('never runs more than `concurrency` workers at once', async () => {
    let active = 0;
    let maxActive = 0;

    await asyncPool(2, [1, 2, 3, 4, 5, 6], async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      // Yield twice so the other pool slots get a chance to start before we finish.
      await Promise.resolve();
      await Promise.resolve();
      active--;
    });

    expect(maxActive).toBe(2);
  });

  it('processes all items even when concurrency exceeds the item count', async () => {
    const processed: number[] = [];

    await asyncPool(10, [1, 2, 3], async item => {
      processed.push(item);
    });

    expect(processed.sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it('does nothing for an empty iterable', async () => {
    let calls = 0;

    await asyncPool(3, [], async () => {
      calls++;
    });

    expect(calls).toBe(0);
  });
});
