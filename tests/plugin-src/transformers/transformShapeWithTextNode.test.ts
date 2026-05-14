import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformShapeWithTextNode } from '@plugin/transformers/transformShapeWithTextNode';
import type * as translators from '@plugin/translators';

type ShapeArg = Parameters<typeof transformShapeWithTextNode>[0];

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): Record<string, never> => ({}),
  transformDimension: (): { width: number; height: number } => ({
    width: 200,
    height: 100
  }),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'shape-id',
    shapeRef: undefined
  }),
  transformRotationAndPosition: (): { x: number; y: number } => ({ x: 50, y: 60 }),
  transformSceneNode: (node: { locked?: boolean; visible: boolean }): Record<string, boolean> => ({
    blocked: Boolean(node.locked),
    hidden: !node.visible
  }),
  transformText: (): Record<string, never> => ({})
}));

vi.mock('@plugin/transformers/transformNodeAsImageRect', () => ({
  transformNodeAsImageRect: vi.fn(async () => ({
    type: 'rect',
    name: 'raster-fallback'
  }))
}));

vi.mock('@plugin/translators', async importOriginal => {
  const actual = await importOriginal<typeof translators>();
  return {
    ...actual,
    translateStrokes: (): never[] => [],
    translateZeroRotation: (): { rotation: number } => ({ rotation: 0 })
  };
});

vi.mock('@plugin/translators/fills', () => ({
  translateFills: (): never[] => []
}));

const createShape = (overrides: Partial<ShapeArg> = {}): ShapeArg => {
  return {
    id: '50:1',
    name: 'Shape 1',
    type: 'SHAPE_WITH_TEXT',
    visible: true,
    locked: false,
    width: 200,
    height: 100,
    shapeType: 'SQUARE',
    absoluteTransform: [
      [1, 0, 50],
      [0, 1, 60]
    ],
    text: {
      characters: 'Hello',
      fontName: { family: 'Inter', style: 'Regular' },
      fills: []
    },
    fills: [],
    strokes: [],
    strokeWeight: 1,
    strokeAlign: 'CENTER',
    dashPattern: [],
    opacity: 1,
    blendMode: 'NORMAL',
    ...overrides
  } as unknown as ShapeArg;
};

describe('transformShapeWithTextNode', () => {
  beforeEach(() => {
    clearAllState();
    vi.clearAllMocks();
  });

  it('emits a frame with a rect child for SQUARE', async () => {
    const result = await transformShapeWithTextNode(createShape({ shapeType: 'SQUARE' }));

    expect(result?.type).toBe('frame');
    const children = (result as { children: { type: string; r1?: number }[] }).children;
    expect(children).toHaveLength(2);
    expect(children[0]?.type).toBe('rect');
    expect(children[0]?.r1).toBe(0);
    expect(children[1]?.type).toBe('text');
  });

  it('applies cornerRadius to the rect child for ROUNDED_RECTANGLE', async () => {
    const result = await transformShapeWithTextNode(
      createShape({ shapeType: 'ROUNDED_RECTANGLE', cornerRadius: 24 } as Partial<ShapeArg>)
    );

    const rect = (result as { children: { r1?: number; r2?: number }[] }).children[0];
    expect(rect?.r1).toBe(24);
    expect(rect?.r2).toBe(24);
  });

  it('falls back to a default cornerRadius when ROUNDED_RECTANGLE has none', async () => {
    const result = await transformShapeWithTextNode(
      createShape({ shapeType: 'ROUNDED_RECTANGLE' } as Partial<ShapeArg>)
    );

    const rect = (result as { children: { r1?: number }[] }).children[0];
    expect(rect?.r1).toBe(16);
  });

  it('emits a frame with a circle child for ELLIPSE', async () => {
    const result = await transformShapeWithTextNode(createShape({ shapeType: 'ELLIPSE' }));

    const children = (result as { children: { type: string }[] }).children;
    expect(children[0]?.type).toBe('circle');
    expect(children[1]?.type).toBe('text');
  });

  it('insets the text child by 8px from the shape origin', async () => {
    const result = await transformShapeWithTextNode(createShape());

    const text = (
      result as {
        children: { type: string; x: number; y: number; width: number; height: number }[];
      }
    ).children[1];
    expect(text.x).toBe(58); // 50 + 8
    expect(text.y).toBe(68); // 60 + 8
    expect(text.width).toBe(184); // 200 - 16
    expect(text.height).toBe(84); // 100 - 16
  });

  it('emits a frame with a path child for DIAMOND', async () => {
    const result = await transformShapeWithTextNode(
      createShape({ shapeType: 'DIAMOND' } as Partial<ShapeArg>)
    );

    expect(result?.type).toBe('frame');
    const children = (result as { children: { type: string; content?: string }[] }).children;
    expect(children[0]?.type).toBe('path');
    expect(children[0]?.content).toContain('Z');
    expect(children[1]?.type).toBe('text');
  });

  it('emits a path child for every Phase 2 shapeType', async () => {
    const phase2Types = [
      'TRIANGLE_UP',
      'TRIANGLE_DOWN',
      'HEXAGON',
      'PENTAGON',
      'OCTAGON',
      'STAR',
      'PLUS',
      'ARROW_LEFT',
      'ARROW_RIGHT',
      'CHEVRON',
      'PARALLELOGRAM_LEFT',
      'PARALLELOGRAM_RIGHT',
      'TRAPEZOID',
      'INTERNAL_STORAGE'
    ] as const;

    for (const shapeType of phase2Types) {
      const result = await transformShapeWithTextNode(
        createShape({ shapeType } as Partial<ShapeArg>)
      );
      const child = (result as { children: { type: string }[] }).children[0];
      expect(child?.type, `expected path child for ${shapeType}`).toBe('path');
    }
  });

  it('falls back to rasterization for unsupported shapeTypes', async () => {
    const result = await transformShapeWithTextNode(
      createShape({ shapeType: 'ENG_DATABASE' } as Partial<ShapeArg>)
    );

    expect(result?.type).toBe('rect');
    expect((result as { name: string }).name).toBe('raster-fallback');
  });
});
