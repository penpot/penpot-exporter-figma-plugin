import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState, degradedLayers } from '@plugin/libraries';
import { buildPenpotDocument } from '@plugin/transformers/buildPenpotDocument';

const { mockProcessAssets } = vi.hoisted(() => ({
  mockProcessAssets: vi.fn()
}));

vi.mock('@plugin/processors', () => ({
  processAssets: mockProcessAssets
}));

vi.mock('@plugin/transformers', () => ({
  isSharedLibrary: false
}));

describe('buildPenpotDocument', () => {
  beforeEach(() => {
    clearAllState();
    vi.clearAllMocks();
    mockProcessAssets.mockResolvedValue([{}, {}]);
  });

  afterEach(() => {
    clearAllState();
  });

  it('includes degraded grid layers in the exported document', async () => {
    degradedLayers.set(
      'degraded-id',
      'Grid frame: exported with default grid track sizing (Figma API error)'
    );

    const document = await buildPenpotDocument('Test document', []);

    expect(document.degradedLayers).toEqual([
      'Grid frame: exported with default grid track sizing (Figma API error)'
    ]);
  });
});
