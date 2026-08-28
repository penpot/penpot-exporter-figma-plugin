import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { degradedLayers } from '@plugin/libraries';
import { translateChildren } from '@plugin/translators/translateChildren';

import type { PenpotNode } from '@ui/types';

const { mockTransformSceneNode } = vi.hoisted(() => ({ mockTransformSceneNode: vi.fn() }));

vi.mock('@common/sleep', () => ({
  yieldByTime: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('@plugin/transformers', () => ({
  transformGroupNodeLike: vi.fn(),
  transformSceneNode: mockTransformSceneNode
}));

vi.mock('@plugin/transformers/partials', () => ({
  transformMaskIds: vi.fn()
}));

describe('translateChildren', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    degradedLayers.clear();
  });

  afterEach(() => {
    degradedLayers.clear();
  });

  it('skips layers affected by a Figma platform error and transforms the remaining children', async () => {
    const failedChild = { id: 'failed-id', name: 'Broken layer', type: 'INSTANCE' } as SceneNode;
    const transformedChild = {
      id: 'transformed-id',
      name: 'Working layer',
      type: 'RECTANGLE'
    } as SceneNode;
    const penpotNode = { id: 'penpot-id' } as PenpotNode;
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    mockTransformSceneNode.mockRejectedValueOnce(
      new Error(
        'in get_componentPropertyReferences: Expected node id to be a string, got undefined'
      )
    );
    mockTransformSceneNode.mockResolvedValueOnce(penpotNode);

    const result = await translateChildren([failedChild, transformedChild]);

    expect(result).toEqual([penpotNode]);
    expect(mockTransformSceneNode).toHaveBeenCalledTimes(2);
    expect(degradedLayers.get(failedChild.id)).toBe(
      'Broken layer: skipped due to a Figma platform error'
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Broken layer'));

    consoleErrorSpy.mockRestore();
  });

  it('propagates errors that are not Figma platform failures', async () => {
    const child = { id: 'failed-id', name: 'Broken layer', type: 'INSTANCE' } as SceneNode;

    mockTransformSceneNode.mockRejectedValueOnce(new Error('boom'));

    await expect(translateChildren([child])).rejects.toThrow('boom');
    expect(degradedLayers).toHaveLength(0);
  });
});
