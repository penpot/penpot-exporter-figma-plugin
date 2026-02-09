import type { Command } from 'svg-path-parser';
import { describe, expect, it, vi } from 'vitest';

import { transformPathNode } from '@plugin/transformers/transformPathNode';

const { parseSVGMock, translateCommandsMock } = vi.hoisted(() => ({
  parseSVGMock: vi.fn<(pathData: string) => Command[]>(),
  translateCommandsMock: vi.fn<(node: LayoutMixin, commands: Command[]) => string>()
}));

vi.mock('svg-path-parser', () => ({
  parseSVG: parseSVGMock
}));

vi.mock('@plugin/translators/vectors', () => ({
  translateCommands: translateCommandsMock
}));

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): Record<string, never> => ({}),
  transformConstraints: (): Record<string, never> => ({}),
  transformEffects: (): Record<string, never> => ({}),
  transformFills: (): Record<string, never> => ({}),
  transformIds: (): Record<string, never> => ({}),
  transformLayoutAttributes: (): Record<string, never> => ({}),
  transformOverrides: (): Record<string, never> => ({}),
  transformProportion: (): Record<string, never> => ({}),
  transformRotation: (): Record<string, never> => ({}),
  transformSceneNode: (): Record<string, never> => ({}),
  transformStrokes: (): Record<string, never> => ({}),
  transformVariableConsumptionMap: (): Record<string, never> => ({})
}));

describe('transformPathNode', () => {
  it('skips invalid path data without throwing', () => {
    vi.clearAllMocks();

    parseSVGMock.mockImplementation(() => {
      throw new SyntaxError('Expected ".", [ \\t\\n\\r], [+\\-], or [0-9] but "n" found.');
    });

    const node = {
      id: 'star-1',
      name: 'Broken Star',
      type: 'STAR',
      fillGeometry: [{ data: 'M nan 0 L 10 10 Z' }]
    } as unknown as StarNode;

    const result = transformPathNode(node);

    expect(result).toBeUndefined();
    expect(translateCommandsMock).not.toHaveBeenCalled();
  });
});
