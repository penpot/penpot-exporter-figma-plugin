import { beforeEach, describe, expect, it, vi } from 'vitest';

import { styleTokenNames, uniqueVariableNames } from '@plugin/libraries';
import { processStyleTokens } from '@plugin/processors/processStyleTokens';

const mockFigma = {
  getLocalEffectStylesAsync: vi.fn()
};

// @ts-expect-error - Mocking global figma object for tests
global.figma = mockFigma as typeof figma;

describe('processStyleTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uniqueVariableNames.clear();
    styleTokenNames.clear();
  });

  it('returns null when no effect styles exist', async () => {
    mockFigma.getLocalEffectStylesAsync.mockResolvedValue([]);

    const result = await processStyleTokens();

    expect(result).toBeNull();
  });

  it('creates set with effect style tokens', async () => {
    mockFigma.getLocalEffectStylesAsync.mockResolvedValue([
      {
        name: 'Shadow',
        description: '',
        effects: [
          {
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            offset: { x: 0, y: 4 },
            radius: 8,
            spread: 0,
            visible: true
          }
        ]
      }
    ]);

    const result = await processStyleTokens();

    expect(result).not.toBeNull();
    const [setName, set] = result!;

    expect(setName).toBe('Figma Styles');
    expect(set['Shadow']).toBeDefined();
    expect(set['Shadow'].$type).toBe('shadow');
  });

  it('skips effect styles with no shadow effects', async () => {
    mockFigma.getLocalEffectStylesAsync.mockResolvedValue([
      {
        name: 'Blur',
        description: '',
        effects: [
          {
            type: 'LAYER_BLUR',
            radius: 10,
            visible: true
          }
        ]
      }
    ]);

    const result = await processStyleTokens();

    expect(result).toBeNull();
  });

  it('populates styleTokenNames for effect styles', async () => {
    mockFigma.getLocalEffectStylesAsync.mockResolvedValue([
      {
        id: 'S:effect-1',
        name: 'Shadow',
        description: '',
        effects: [
          {
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            offset: { x: 0, y: 4 },
            radius: 8,
            spread: 0,
            visible: true
          }
        ]
      }
    ]);

    await processStyleTokens();

    expect(styleTokenNames.get('S:effect-1')).toBe('Shadow');
  });
});
