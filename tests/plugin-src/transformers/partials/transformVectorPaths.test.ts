import { describe, expect, it, vi } from 'vitest';

import { transformVectorPaths } from '@plugin/transformers/partials/transformVectorPaths';

vi.mock('@plugin/transformers/partials', async () => ({
  ...(await vi.importActual('@plugin/transformers/partials/transformOverrides')),
  transformBlend: (): Record<string, never> => ({}),
  transformConstraints: (): Record<string, never> => ({}),
  transformEffects: (): Record<string, never> => ({}),
  transformLayoutAttributes: (): Record<string, never> => ({}),
  transformProportion: (): Record<string, never> => ({}),
  transformSceneNode: (): Record<string, never> => ({}),
  transformStrokes: (): { strokes: never[] } => ({ strokes: [] }),
  transformStrokesFromVector: (): { strokes: never[] } => ({ strokes: [] }),
  transformVariableConsumptionMap: (): {
    appliedTokens: { strokeColor: string };
  } => ({ appliedTokens: { strokeColor: 'primary' } }),
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
    type: 'VECTOR',
    strokes: [],
    ...overrides
  } as unknown as VectorNode;
};

describe('transformVectorPaths', () => {
  it('adds the applied tokens of the vector on each of its paths', () => {
    const node = createVectorNode({
      vectorPaths: [
        { data: 'M 0 0 L 10 10 Z', windingRule: 'NONZERO' },
        { data: 'M 20 20 L 30 30 Z', windingRule: 'NONZERO' }
      ]
    });

    const paths = transformVectorPaths(node);

    expect(paths).toHaveLength(2);
    paths.forEach(path => expect(path.appliedTokens).toEqual({ strokeColor: 'primary' }));
  });
});
