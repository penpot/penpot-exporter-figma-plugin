import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformIds, transformInstanceIds } from '@plugin/transformers/partials/transformIds';
import { translateTouched } from '@plugin/translators/translateTouched';
import { generateDeterministicUuid } from '@plugin/utils';

const createComponent = (key: string): ComponentNode =>
  ({ type: 'COMPONENT', key }) as unknown as ComponentNode;

const createInstance = (id: string, mainComponent: ComponentNode): InstanceNode =>
  ({
    id,
    type: 'INSTANCE',
    getMainComponentAsync: async () => mainComponent
  }) as unknown as InstanceNode;

const star = createComponent('star');
const heart = createComponent('heart');

// Card main (1:1) contains a Star instance (3:4); 1:2 is a Card instance
const nodes: Map<string, SceneNode> = new Map();

const mockFigma = {
  getNodeByIdAsync: vi.fn(async (id: string) => nodes.get(id) ?? null)
};
// @ts-expect-error - Mocking global figma object
global.figma = mockFigma;

describe('transformInstanceIds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAllState();
    nodes.clear();
    nodes.set('3:4', createInstance('3:4', star));
  });

  it('keeps the related shapeRef on a non-swapped nested instance', async () => {
    const result = await transformInstanceIds(createInstance('I1:2;3:4', star), star);

    expect(result.shapeRef).toBe(generateDeterministicUuid('3:4'));
    expect(translateTouched(createInstance('I1:2;3:4', star))).toEqual([]);
  });

  it('points a swapped nested instance to the new main and marks its swap slot', async () => {
    const node = createInstance('I1:2;3:4', heart);
    const result = await transformInstanceIds(node, heart);

    expect(result.shapeRef).toBe(generateDeterministicUuid('id-heart'));
    expect(result.componentId).toBe(generateDeterministicUuid('heart'));
    expect(translateTouched(node)).toEqual([`swap-slot-${generateDeterministicUuid('3:4')}`]);
  });

  it('resolves descendants of a swapped instance relative to the new component', async () => {
    await transformInstanceIds(createInstance('I1:2;3:4', heart), heart);

    const child = { id: 'I1:2;3:4;5:6', type: 'RECTANGLE' } as unknown as SceneNode;
    const grandChild = { id: 'I1:2;3:4;5:6;7:8', type: 'RECTANGLE' } as unknown as SceneNode;

    expect(transformIds(child).shapeRef).toBe(generateDeterministicUuid('5:6'));
    expect(transformIds(grandChild).shapeRef).toBe(generateDeterministicUuid('5:6;7:8'));
  });

  it('keeps the related shapeRef when the replaced node cannot be resolved', async () => {
    nodes.clear();

    const node = createInstance('I1:2;3:4', heart);
    const result = await transformInstanceIds(node, heart);

    expect(result.shapeRef).toBe(generateDeterministicUuid('3:4'));
    expect(translateTouched(node)).toEqual([]);
  });

  it('does not look up the replaced node for a top-level instance', async () => {
    const result = await transformInstanceIds(createInstance('1:2', star), star);

    expect(result.shapeRef).toBe(generateDeterministicUuid('id-star'));
    expect(mockFigma.getNodeByIdAsync).not.toHaveBeenCalled();
  });
});
