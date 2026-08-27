import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState, degradedLayers } from '@plugin/libraries';
import { transformAutoLayout } from '@plugin/transformers/partials/transformLayout';

const { mockTranslateGridCells, mockTranslateGridTracks } = vi.hoisted(() => ({
  mockTranslateGridCells: vi.fn(),
  mockTranslateGridTracks: vi.fn()
}));

vi.mock('@plugin/translators', () => ({
  translateGridCells: mockTranslateGridCells,
  translateGridTracks: mockTranslateGridTracks,
  translateLayoutAlignContent: vi.fn().mockReturnValue('start'),
  translateLayoutAlignItems: vi.fn().mockReturnValue('start'),
  translateLayoutFlexDir: vi.fn(),
  translateLayoutGap: vi.fn().mockReturnValue({ rowGap: 8, columnGap: 8 }),
  translateLayoutGridDir: vi.fn().mockReturnValue('row'),
  translateLayoutItemAlignSelf: vi.fn(),
  translateLayoutJustifyContent: vi.fn().mockReturnValue('start'),
  translateLayoutJustifyItems: vi.fn().mockReturnValue('start'),
  translateLayoutMode: vi.fn().mockReturnValue('grid'),
  translateLayoutPadding: vi.fn().mockReturnValue({ p1: 0, p2: 0, p3: 0, p4: 0 }),
  translateLayoutPaddingType: vi.fn().mockReturnValue('multiple'),
  translateLayoutSizing: vi.fn(),
  translateLayoutWrapType: vi.fn()
}));

const createGridNode = (): BaseFrameMixin => {
  return {
    id: 'grid-id',
    name: 'Grid frame',
    layoutMode: 'GRID',
    gridRowSizes: [{ type: 'FIXED', value: 100 }],
    gridColumnSizes: [{ type: 'FIXED', value: 200 }]
  } as unknown as BaseFrameMixin;
};

const createTrackWithFailingTypeRead = (): GridTrackSize => {
  const track = { value: 100 };

  Object.defineProperty(track, 'type', {
    get: (): never => {
      throw new Error('Attempted to invoke callback with invalid id');
    }
  });

  return track as GridTrackSize;
};

describe('transformAutoLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAllState();
    mockTranslateGridTracks.mockImplementation(
      (tracks: GridTrackSize[]): GridTrackSize[] => tracks
    );
    mockTranslateGridCells.mockReturnValue({ 'cell-id': { row: 1, column: 1 } });
  });

  afterEach(() => {
    clearAllState();
  });

  it('exports a healthy grid layout', () => {
    const node = createGridNode();

    expect(transformAutoLayout(node)).toEqual({
      layout: 'grid',
      layoutGap: { rowGap: 8, columnGap: 8 },
      layoutGapType: 'multiple',
      layoutPadding: { p1: 0, p2: 0, p3: 0, p4: 0 },
      layoutPaddingType: 'multiple',
      layoutJustifyContent: 'start',
      layoutJustifyItems: 'start',
      layoutAlignContent: 'start',
      layoutAlignItems: 'start',
      layoutGridDir: 'row',
      layoutGridRows: [{ type: 'FIXED', value: 100 }],
      layoutGridColumns: [{ type: 'FIXED', value: 200 }],
      layoutGridCells: { 'cell-id': { row: 1, column: 1 } }
    });
    expect(degradedLayers).toHaveLength(0);
  });

  it('uses default flex tracks when grid track property reads fail', () => {
    const node = createGridNode();
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    Object.defineProperties(node, {
      gridRowSizes: { value: [createTrackWithFailingTypeRead()] },
      gridColumnSizes: { value: [createTrackWithFailingTypeRead()] }
    });
    mockTranslateGridTracks.mockImplementation((tracks: GridTrackSize[]): GridTrackSize[] =>
      tracks.map(track => ({ ...track, type: track.type }))
    );

    expect(transformAutoLayout(node)).toEqual({
      layout: 'grid',
      layoutGap: { rowGap: 8, columnGap: 8 },
      layoutGapType: 'multiple',
      layoutPadding: { p1: 0, p2: 0, p3: 0, p4: 0 },
      layoutPaddingType: 'multiple',
      layoutJustifyContent: 'start',
      layoutJustifyItems: 'start',
      layoutAlignContent: 'start',
      layoutAlignItems: 'start',
      layoutGridDir: 'row',
      layoutGridRows: [{ type: 'flex', value: 1 }],
      layoutGridColumns: [{ type: 'flex', value: 1 }],
      layoutGridCells: { 'cell-id': { row: 1, column: 1 } }
    });
    expect(degradedLayers.get('grid-id')).toBe(
      'Grid frame: exported with default grid track sizing (Figma API error)'
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('default grid track sizing')
    );

    consoleWarnSpy.mockRestore();
  });

  it('exports a plain frame when the grid fallback also fails', () => {
    const node = createGridNode();
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    Object.defineProperty(node, 'gridRowSizes', {
      get: (): never => {
        throw new Error('Attempted to invoke callback with invalid id');
      }
    });

    expect(transformAutoLayout(node)).toEqual({});
    expect(degradedLayers.get('grid-id')).toBe(
      'Grid frame: exported without grid layout (Figma API error)'
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('without grid layout'));

    consoleWarnSpy.mockRestore();
  });
});
