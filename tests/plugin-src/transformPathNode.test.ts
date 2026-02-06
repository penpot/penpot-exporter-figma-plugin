import type { Command } from 'svg-path-parser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('skips invalid path data and logs a warning', () => {
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
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[Penpot Exporter] Skipping invalid path node',
      expect.objectContaining({
        nodeId: 'star-1',
        nodeName: 'Broken Star',
        nodeType: 'STAR',
        source: 'fillGeometry[0]'
      })
    );
  });
});
