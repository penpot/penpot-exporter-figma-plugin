import type { Command } from 'svg-path-parser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearParsedCache,
  transformVectorPaths
} from '@plugin/transformers/partials/transformVectorPaths';

const { parseSVGMock, translateCommandsMock } = vi.hoisted(() => ({
  parseSVGMock: vi.fn<(pathData: string) => Command[]>(),
  translateCommandsMock: vi.fn<(node: LayoutMixin, commands: Command[]) => string>()
}));

vi.mock('svg-path-parser', () => ({
  parseSVG: parseSVGMock
}));

vi.mock('@plugin/translators/vectors', () => ({
  translateCommands: translateCommandsMock,
  translateWindingRule: vi.fn(() => 'evenodd')
}));

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): Record<string, never> => ({}),
  transformEffects: (): Record<string, never> => ({}),
  transformLayoutAttributes: (): Record<string, never> => ({}),
  transformProportion: (): Record<string, never> => ({}),
  transformSceneNode: (): Record<string, never> => ({}),
  transformStrokesFromVector: (): Record<string, never> => ({}),
  transformVectorFills: (): Record<string, never> => ({}),
  transformVectorIds: (): Record<string, never> => ({})
}));

describe('transformVectorPaths', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearParsedCache();
  });

  it('skips invalid fillGeometry path without throwing', () => {
    parseSVGMock.mockImplementation(() => {
      throw new SyntaxError('Expected ".", [ \\t\\n\\r], [+\\-], or [0-9] but "n" found.');
    });

    const invalidData = `${'M 0 0 '.repeat(43)} nan Z`;

    expect(invalidData.length).toBe(264);

    const node = {
      id: '5179:3299',
      name: 'Rectangle 180',
      type: 'VECTOR',
      strokes: [],
      fills: [],
      vectorNetwork: { regions: [] },
      vectorPaths: [],
      fillGeometry: [{ data: invalidData, windingRule: 'NONZERO' }]
    } as unknown as VectorNode;

    const result = transformVectorPaths(node);

    expect(result).toEqual([]);
    expect(translateCommandsMock).not.toHaveBeenCalled();
  });
});
