import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformSceneNode } from '@plugin/transformers/transformSceneNode';
import { transformSlideNode } from '@plugin/transformers/transformSlideNode';

vi.mock('@plugin/transformers/partials', () => ({
  transformAutoLayout: (): Record<string, never> => ({}),
  transformBlend: (): Record<string, never> => ({}),
  transformChildren: async (): Promise<{ children: never[] }> => ({ children: [] }),
  transformConstraints: (): Record<string, never> => ({}),
  transformCornerRadius: (): Record<string, never> => ({}),
  transformDimension: (): { width: number; height: number } => ({
    width: 1920,
    height: 1080
  }),
  transformEffects: (): Record<string, never> => ({}),
  transformFills: (): { fills: never[] } => ({ fills: [] }),
  transformGrids: (): Record<string, never> => ({}),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'slide-id',
    shapeRef: undefined
  }),
  transformLayoutAttributes: (): Record<string, never> => ({}),
  transformOverrides: (): Record<string, never> => ({}),
  transformProportion: (): Record<string, never> => ({}),
  transformRotationAndPosition: (): { x: number; y: number } => ({
    x: 0,
    y: 0
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

const createSlideNode = (overrides: Partial<SlideNode> = {}): SlideNode => {
  return {
    id: '10:1',
    name: 'Slide 1',
    type: 'SLIDE',
    visible: true,
    locked: false,
    clipsContent: false,
    absoluteTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ],
    ...overrides
  } as unknown as SlideNode;
};

const createInteractiveSlideElement = (): SceneNode => {
  return {
    id: '10:99',
    name: 'YouTube embed',
    type: 'INTERACTIVE_SLIDE_ELEMENT',
    visible: true,
    locked: false
  } as unknown as SceneNode;
};

describe('slide node export', () => {
  beforeEach(() => {
    clearAllState();
    vi.clearAllMocks();

    // @ts-expect-error - Mocking global figma object for transformer tests
    global.figma = {
      root: {
        name: 'Test deck'
      }
    };
  });

  it('routes SLIDE nodes through transformFrameNode when reached via transformSceneNode', async () => {
    const result = await transformSceneNode(createSlideNode() as unknown as SceneNode);

    expect(result).toBeDefined();
    expect(result?.type).toBe('frame');
  });

  it('transformSlideNode returns a FrameShape with the slide name', async () => {
    const result = await transformSlideNode(
      createSlideNode({ name: 'Cover slide' } as Partial<SlideNode>)
    );

    expect(result.type).toBe('frame');
    expect(result.name).toBe('Cover slide');
  });

  it('skips INTERACTIVE_SLIDE_ELEMENT with a console.warn', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await transformSceneNode(createInteractiveSlideElement());

    expect(result).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('INTERACTIVE_SLIDE_ELEMENT'));

    warnSpy.mockRestore();
  });
});
