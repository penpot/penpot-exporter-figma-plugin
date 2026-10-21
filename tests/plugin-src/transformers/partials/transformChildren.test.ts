import { beforeEach, describe, expect, it, vi } from 'vitest';

import { transformChildren } from '@plugin/transformers/partials/transformChildren';

import type { PenpotNode } from '@ui/types';

const { mockTranslateChildren, mockTranslateMaskChildren } = vi.hoisted(() => ({
  mockTranslateChildren: vi.fn(),
  mockTranslateMaskChildren: vi.fn()
}));

vi.mock('@plugin/translators', () => ({
  translateChildren: mockTranslateChildren,
  translateMaskChildren: mockTranslateMaskChildren
}));

const createNode = (depth = 1): ChildrenMixin => {
  return {
    children: depth > 1 ? [createNode(depth - 1)] : []
  } as unknown as ChildrenMixin;
};

const transformNestedChildren = async (children: readonly SceneNode[]): Promise<PenpotNode[]> => {
  for (const child of children) {
    await transformChildren(child as unknown as ChildrenMixin);
  }

  return [];
};

describe('transformChildren', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTranslateChildren.mockResolvedValue([]);
  });

  it('restores the previous depth when a nested transformation throws', async () => {
    const failingNode = createNode();
    const rootWithFailingChild = {
      children: [failingNode]
    } as unknown as ChildrenMixin;

    mockTranslateChildren.mockImplementationOnce(transformNestedChildren);
    mockTranslateChildren.mockRejectedValueOnce(new Error('broken child'));

    await expect(transformChildren(rootWithFailingChild)).rejects.toThrow('broken child');

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    mockTranslateChildren.mockImplementation(transformNestedChildren);

    await transformChildren(createNode(4));

    expect(setTimeoutSpy).not.toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
  });

  it('stacks the first child on top when the auto layout reverses the z-index', async () => {
    const node = {
      children: [{}, {}, {}],
      layoutMode: 'HORIZONTAL',
      itemReverseZIndex: true
    } as unknown as ChildrenMixin;

    mockTranslateChildren.mockResolvedValue([
      { name: 'first' },
      { name: 'absolute', layoutItemAbsolute: true },
      { name: 'last' }
    ]);

    const { children } = await transformChildren(node);

    expect(children).toEqual([
      { name: 'first', layoutItemZIndex: 2 },
      { name: 'absolute', layoutItemAbsolute: true },
      { name: 'last', layoutItemZIndex: 0 }
    ]);
  });

  it.each([
    { layoutMode: 'HORIZONTAL', itemReverseZIndex: false },
    { layoutMode: 'NONE', itemReverseZIndex: true },
    { layoutMode: 'GRID', itemReverseZIndex: true }
  ])(
    'keeps the default stacking for $layoutMode layouts with reverse z-index $itemReverseZIndex',
    async layout => {
      const node = { children: [{}, {}], ...layout } as unknown as ChildrenMixin;

      mockTranslateChildren.mockResolvedValue([{ name: 'first' }, { name: 'last' }]);

      const { children } = await transformChildren(node);

      expect(children).toEqual([{ name: 'first' }, { name: 'last' }]);
    }
  );
});
