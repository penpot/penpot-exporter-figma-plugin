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
});
