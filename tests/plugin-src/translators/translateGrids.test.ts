import { describe, expect, it } from 'vitest';

import { translateGrids } from '@plugin/translators';

describe('translateGrids', () => {
  it('drops NaN sectionSize on a row grid (Penpot rejects NaN)', () => {
    const [grid] = translateGrids([
      {
        pattern: 'ROWS',
        alignment: 'STRETCH',
        gutterSize: 0,
        count: 0,
        offset: 0,
        sectionSize: NaN,
        visible: false,
        color: { r: 1, g: 0, b: 0, a: 0.1 }
      } as unknown as LayoutGrid
    ]);

    expect(grid.params.itemLength).toBeUndefined();
  });

  it('drops non-finite count (Infinity / NaN) on a column grid', () => {
    const [infinite, nan] = translateGrids([
      {
        pattern: 'COLUMNS',
        alignment: 'STRETCH',
        gutterSize: 16,
        count: Infinity,
        offset: 0,
        sectionSize: 51,
        visible: true,
        color: { r: 1, g: 0, b: 0, a: 0.1 }
      } as unknown as LayoutGrid,
      {
        pattern: 'COLUMNS',
        alignment: 'MIN',
        gutterSize: 16,
        count: NaN,
        offset: 0,
        sectionSize: 51,
        visible: true,
        color: { r: 1, g: 0, b: 0, a: 0.1 }
      } as unknown as LayoutGrid
    ]);

    expect(infinite.params.size).toBeUndefined();
    expect(nan.params.size).toBeUndefined();
  });

  it('keeps finite numeric values', () => {
    const [grid] = translateGrids([
      {
        pattern: 'COLUMNS',
        alignment: 'MIN',
        gutterSize: 16,
        count: 12,
        offset: 118,
        sectionSize: 51,
        visible: true,
        color: { r: 1, g: 0, b: 0, a: 0.1 }
      } as unknown as LayoutGrid
    ]);

    expect(grid.params.size).toBe(12);
    expect(grid.params.itemLength).toBe(51);
    expect(grid.params.margin).toBe(118);
    expect(grid.params.gutter).toBe(16);
  });

  it('drops a square grid whose size is non-finite (size is required)', () => {
    const grids = translateGrids([
      {
        pattern: 'GRID',
        sectionSize: NaN,
        visible: true,
        color: { r: 1, g: 0, b: 0, a: 0.1 }
      } as unknown as LayoutGrid
    ]);

    expect(grids).toHaveLength(0);
  });
});
