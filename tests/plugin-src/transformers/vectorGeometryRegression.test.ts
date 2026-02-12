import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearParsedCache,
  transformVectorPaths
} from '@plugin/transformers/partials/transformVectorPaths';
import { transformPathNode } from '@plugin/transformers/transformPathNode';

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): Record<string, never> => ({}),
  transformConstraints: (): Record<string, never> => ({}),
  transformEffects: (): Record<string, never> => ({}),
  transformFills: (): { fills: never[] } => ({ fills: [] }),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'shape-id',
    shapeRef: undefined
  }),
  transformLayoutAttributes: (): Record<string, never> => ({}),
  transformOverrides: (): Record<string, never> => ({}),
  transformProportion: (): Record<string, never> => ({}),
  transformRotation: (): Record<string, never> => ({}),
  transformSceneNode: (): Record<string, never> => ({}),
  transformStrokes: (): { strokes: never[] } => ({ strokes: [] }),
  transformStrokesFromVector: (): { strokes: never[] } => ({ strokes: [] }),
  transformVariableConsumptionMap: (): Record<string, never> => ({}),
  transformVectorFills: (): { fills: never[] } => ({ fills: [] }),
  transformVectorIds: (_node: unknown, index: number): { id: string; shapeRef: undefined } => ({
    id: `vector-${index}`,
    shapeRef: undefined
  })
}));

vi.mock('@plugin/translators/vectors', () => ({
  translateCommands: (): string => 'M 0 0',
  translateWindingRule: (): string => 'nonzero'
}));

const createVectorNode = (overrides: Partial<VectorNode> = {}): VectorNode => {
  return {
    id: '1:1',
    name: 'Vector',
    type: 'VECTOR',
    strokes: [],
    fills: [],
    fillGeometry: [],
    vectorPaths: [],
    vectorNetwork: {
      regions: [],
      vertices: []
    },
    ...overrides
  } as unknown as VectorNode;
};

const createPathNode = (overrides: Partial<StarNode> = {}): StarNode => {
  return {
    id: '2:1',
    name: 'Path',
    type: 'STAR',
    fillGeometry: [{ data: 'M 0 0 L 10 0 Z', windingRule: 'NONZERO' }],
    ...overrides
  } as unknown as StarNode;
};

describe('vector geometry regression', () => {
  beforeEach(() => {
    clearParsedCache();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('skips invalid fillGeometry path data without crashing export', () => {
    const node = createVectorNode({
      fillGeometry: [{ data: 'M 0 0 L nan 10 Z', windingRule: 'NONZERO' }],
      vectorPaths: [{ data: 'M 0 0 L 10 10 Z', windingRule: 'NONZERO' }]
    });

    let result: ReturnType<typeof transformVectorPaths> = [];

    expect(() => {
      result = transformVectorPaths(node);
    }).not.toThrow();
    expect(result).toHaveLength(1);
  });

  it('handles vectorPaths getter throwing a Figma internal error', () => {
    const node = createVectorNode();

    Object.defineProperty(node, 'vectorPaths', {
      get: () => {
        throw new Error('in get_vectorPaths: Figma Internal Error: vector is missing data');
      }
    });

    let result: ReturnType<typeof transformVectorPaths> = [];

    expect(() => {
      result = transformVectorPaths(node);
    }).not.toThrow();
    expect(result).toHaveLength(0);
  });

  it('returns undefined for star/polygon nodes with invalid fillGeometry path data', () => {
    const node = createPathNode({
      fillGeometry: [{ data: 'M 0 0 L nan 10 Z', windingRule: 'NONZERO' }]
    });

    let result: ReturnType<typeof transformPathNode> = undefined;

    expect(() => {
      result = transformPathNode(node);
    }).not.toThrow();
    expect(result).toBeUndefined();
  });
});
