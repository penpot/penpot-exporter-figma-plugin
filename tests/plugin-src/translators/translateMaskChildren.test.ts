import { beforeEach, describe, expect, it, vi } from 'vitest';

import { transformMaskOverrides } from '@plugin/transformers/partials';
import { translateMaskChildren } from '@plugin/translators/translateChildren';

vi.mock('@plugin/transformers', () => ({
  transformSceneNode: vi.fn(async (node: SceneNode) => ({ name: node.name })),
  transformGroupNodeLike: vi.fn((node: SceneNode) => ({ type: 'group', name: node.name }))
}));

vi.mock('@plugin/transformers/partials', () => ({
  transformMaskIds: vi.fn((node: SceneNode) => ({ id: `mask-${node.name}` })),
  transformMaskOverrides: vi.fn(() => ({}))
}));

vi.mock('@common/sleep', () => ({
  yieldByTime: vi.fn(async () => undefined)
}));

const layer = (name: string, isMask = false, visible = true): SceneNode =>
  ({ name, type: 'RECTANGLE', isMask, visible }) as unknown as SceneNode;

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
        hidden: false,
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
        hidden: false,
        maskedGroup: true,
        children: [{ name: 'mask 1' }, { name: 'a' }]
      },
      {
        id: 'mask-mask 2',
        type: 'group',
        name: 'mask 2',
        hidden: false,
        maskedGroup: true,
        children: [{ name: 'mask 2' }, { name: 'b' }]
      }
    ]);
  });

  it('keeps the overrides of the mask on the mask group', async () => {
    vi.mocked(transformMaskOverrides).mockReturnValueOnce({ touched: ['name-group'] });

    const [maskGroup] = await translateMaskChildren([layer('mask', true), layer('a')], 0);

    expect(maskGroup).toMatchObject({
      id: 'mask-mask',
      maskedGroup: true,
      touched: ['name-group']
    });
  });

  it('leaves the siblings of a hidden mask unmasked, as Figma does', async () => {
    const [maskGroup] = await translateMaskChildren([layer('mask', true, false), layer('a')], 0);

    expect(maskGroup).toMatchObject({ hidden: false, maskedGroup: false });
  });
});
