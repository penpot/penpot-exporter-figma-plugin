import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformFrameNode } from '@plugin/transformers/transformFrameNode';
import { transformSceneNode } from '@plugin/transformers/transformSceneNode';

vi.mock('@plugin/transformers/partials', () => ({
  transformAutoLayout: (): Record<string, never> => ({}),
  transformBlend: (): Record<string, never> => ({}),
  transformChildren: async (): Promise<{ children: never[] }> => ({ children: [] }),
  transformConstraints: (): Record<string, never> => ({}),
  transformCornerRadius: (): Record<string, never> => ({}),
  transformDimension: (): { width: number; height: number } => ({
    width: 100,
    height: 100
  }),
  transformEffects: (): Record<string, never> => ({}),
  transformFills: (): { fills: never[] } => ({ fills: [] }),
  transformGrids: (): Record<string, never> => ({}),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'slot-id',
    shapeRef: undefined
  }),
  transformLayoutAttributes: (): Record<string, never> => ({}),
  transformOverrides: (): Record<string, never> => ({}),
  transformProportion: (): Record<string, never> => ({}),
  transformRotationAndPosition: (): { x: number; y: number } => ({
    x: 10,
    y: 20
  }),
  transformSceneNode: (node: {
    locked?: boolean;
    visible: boolean;
  }): {
    blocked: boolean;
    hidden: boolean;
  } => ({
    blocked: Boolean(node.locked),
    hidden: !node.visible
  }),
  transformStrokes: (): { strokes: never[] } => ({ strokes: [] }),
  transformVariableConsumptionMap: (): Record<string, never> => ({})
}));

const createSlotNode = (): SlotNode => {
  return {
    id: '5:1',
    name: 'Icon slot',
    type: 'SLOT',
    visible: true,
    locked: false,
    clipsContent: false,
    absoluteTransform: [
      [1, 0, 10],
      [0, 1, 20]
    ]
  } as unknown as SlotNode;
};

describe('slot node export', () => {
  beforeEach(() => {
    clearAllState();

    // @ts-expect-error - Mocking global figma object for transformer tests
    global.figma = {
      root: {
        name: 'Test file'
      }
    };
  });

  it('routes SLOT nodes through transformFrameNode when reached via transformSceneNode', async () => {
    const result = await transformSceneNode(createSlotNode() as unknown as SceneNode);

    expect(result).toBeDefined();
    expect(result?.type).toBe('frame');
  });

  it('transformFrameNode accepts a SlotNode and produces a FrameShape', async () => {
    const result = await transformFrameNode(createSlotNode());

    expect(result.type).toBe('frame');
    expect(result.name).toBe('Icon slot');
  });
});
