import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformInstanceNode } from '@plugin/transformers/transformInstanceNode';

vi.mock('@plugin/transformers/partials', () => {
  const empty = (): Record<string, never> => ({});

  return {
    transformAutoLayout: empty,
    transformBlend: empty,
    transformChildren: async (): Promise<{ children: never[] }> => ({ children: [] }),
    transformConstraints: empty,
    transformCornerRadius: empty,
    transformDimension: empty,
    transformEffects: empty,
    transformFills: empty,
    transformGrids: empty,
    transformInstanceIds: empty,
    transformLayoutAttributes: empty,
    transformOverrides: empty,
    transformProportion: empty,
    transformRotationAndPosition: empty,
    transformSceneNode: empty,
    transformStrokes: empty,
    transformVariableConsumptionMap: empty
  };
});

const createInstanceNode = (id: string, parent: unknown = null): InstanceNode =>
  ({
    id,
    type: 'INSTANCE',
    name: 'Instance',
    visible: true,
    locked: false,
    clipsContent: true,
    parent,
    overrides: [],
    getMainComponentAsync: async () => ({
      parent: {},
      remote: false,
      visible: true,
      locked: false,
      getPluginData: () => ''
    })
  }) as unknown as InstanceNode;

describe('transformInstanceNode componentRoot', () => {
  beforeEach(() => {
    clearAllState();
  });

  it('keeps componentRoot: true on a root instance', async () => {
    const result = await transformInstanceNode(
      createInstanceNode('1:2', { type: 'PAGE', parent: null })
    );

    expect(result?.componentRoot).toBe(true);
  });

  it('omits componentRoot on a nested copy (id starts with I)', async () => {
    const result = await transformInstanceNode(createInstanceNode('I1:2;3:4'));

    expect(result).not.toHaveProperty('componentRoot');
  });

  it('omits componentRoot on an instance inside a component', async () => {
    const result = await transformInstanceNode(
      createInstanceNode('1:2', { type: 'COMPONENT', parent: null })
    );

    expect(result).not.toHaveProperty('componentRoot');
  });
});
