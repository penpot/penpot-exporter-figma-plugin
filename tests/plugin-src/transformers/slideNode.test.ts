import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformSceneNode } from '@plugin/transformers/transformSceneNode';
import {
  hideDescendantArtboardsFromViewer,
  transformSlideNode
} from '@plugin/transformers/transformSlideNode';

import type { PenpotNode } from '@ui/types/penpotNode';

type SlideNodeArg = Parameters<typeof transformSlideNode>[0];
type SceneNodeArg = Parameters<typeof transformSceneNode>[0];

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

const createSlideNode = (overrides: Partial<SlideNodeArg> = {}): SlideNodeArg => {
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
  } as unknown as SlideNodeArg;
};

const createInteractiveSlideElement = (): SceneNodeArg => {
  return {
    id: '10:99',
    name: 'YouTube embed',
    type: 'INTERACTIVE_SLIDE_ELEMENT',
    visible: true,
    locked: false
  } as unknown as SceneNodeArg;
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
    const result = await transformSceneNode(createSlideNode() as unknown as SceneNodeArg);

    expect(result).toBeDefined();
    expect(result?.type).toBe('frame');
  });

  it('transformSlideNode returns a FrameShape with the slide name', async () => {
    const result = await transformSlideNode(
      createSlideNode({ name: 'Cover slide' } as Partial<SlideNodeArg>)
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

describe('hideDescendantArtboardsFromViewer', () => {
  it('marks nested frames, components and instances with hideInViewer=true', () => {
    const children = [
      { type: 'frame', children: [] },
      { type: 'component', children: [] },
      { type: 'instance', children: [] }
    ] as unknown as PenpotNode[];

    hideDescendantArtboardsFromViewer(children);

    expect((children[0] as { hideInViewer?: boolean }).hideInViewer).toBe(true);
    expect((children[1] as { hideInViewer?: boolean }).hideInViewer).toBe(true);
    expect((children[2] as { hideInViewer?: boolean }).hideInViewer).toBe(true);
  });

  it('does not touch non-artboard shape types', () => {
    const children = [
      { type: 'rect' },
      { type: 'text' },
      { type: 'path' },
      { type: 'circle' },
      { type: 'group', children: [] },
      { type: 'bool', children: [] }
    ] as unknown as PenpotNode[];

    hideDescendantArtboardsFromViewer(children);

    for (const child of children) {
      expect((child as { hideInViewer?: boolean }).hideInViewer).toBeUndefined();
    }
  });

  it('recurses into nested children to hide deeply nested artboards', () => {
    const deepFrame = { type: 'frame', children: [] } as unknown as PenpotNode;
    const groupWrapper = {
      type: 'group',
      children: [deepFrame]
    } as unknown as PenpotNode;
    const rootFrame = {
      type: 'frame',
      children: [groupWrapper]
    } as unknown as PenpotNode;

    hideDescendantArtboardsFromViewer([rootFrame]);

    expect((rootFrame as { hideInViewer?: boolean }).hideInViewer).toBe(true);
    expect((deepFrame as { hideInViewer?: boolean }).hideInViewer).toBe(true);
    expect((groupWrapper as { hideInViewer?: boolean }).hideInViewer).toBeUndefined();
  });

  it('handles undefined children gracefully', () => {
    expect(() => hideDescendantArtboardsFromViewer(undefined)).not.toThrow();
  });

  it('keeps slide root as the only entry point after transformSlideNode', async () => {
    const slide = await transformSlideNode(createSlideNode());

    slide.children = [
      { type: 'frame', children: [] },
      { type: 'instance', children: [] }
    ] as unknown as PenpotNode[];

    hideDescendantArtboardsFromViewer(slide.children);
    slide.hideInViewer = false;

    expect(slide.hideInViewer).toBe(false);
    expect((slide.children?.[0] as { hideInViewer?: boolean }).hideInViewer).toBe(true);
    expect((slide.children?.[1] as { hideInViewer?: boolean }).hideInViewer).toBe(true);
  });
});
