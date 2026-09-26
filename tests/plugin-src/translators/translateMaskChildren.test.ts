import { beforeEach, describe, expect, it, vi } from 'vitest';

import { translateMaskChildren } from '@plugin/translators/translateChildren';

vi.mock('@plugin/transformers', () => ({
  transformSceneNode: vi.fn(async (node: SceneNode) => ({ name: node.name })),
  transformGroupNodeLike: vi.fn((node: SceneNode) => ({ type: 'group', name: node.name }))
}));

vi.mock('@plugin/transformers/partials', () => ({
  transformMaskIds: vi.fn((node: SceneNode) => ({ id: `mask-${node.name}` }))
}));

vi.mock('@common/sleep', () => ({
  yieldByTime: vi.fn(async () => undefined)
}));

const layer = (name: string, isMask = false): SceneNode =>
  ({ name, type: 'RECTANGLE', isMask }) as unknown as SceneNode;

describe('translateMaskChildren', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('masks every sibling above a single mask', async () => {
    const children = [layer('below'), layer('mask', true), layer('a'), layer('b')];

    expect(await translateMaskChildren(children, 1)).toEqual([
      { name: 'below' },
      {
        id: 'mask-mask',
        type: 'group',
        name: 'mask',
        maskedGroup: true,
        children: [{ name: 'mask' }, { name: 'a' }, { name: 'b' }]
      }
    ]);
  });

  it('stops a mask at the next mask in the same parent', async () => {
    const children = [
      layer('below'),
      layer('mask 1', true),
      layer('a'),
      layer('mask 2', true),
      layer('b')
    ];

    expect(await translateMaskChildren(children, 1)).toEqual([
      { name: 'below' },
      {
        id: 'mask-mask 1',
        type: 'group',
        name: 'mask 1',
        maskedGroup: true,
        children: [{ name: 'mask 1' }, { name: 'a' }]
      },
      {
        id: 'mask-mask 2',
        type: 'group',
        name: 'mask 2',
        maskedGroup: true,
        children: [{ name: 'mask 2' }, { name: 'b' }]
      }
    ]);
  });
});
