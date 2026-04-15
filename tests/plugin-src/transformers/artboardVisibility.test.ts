import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformComponentNode } from '@plugin/transformers/transformComponentNode';
import { transformFrameNode } from '@plugin/transformers/transformFrameNode';
import { transformInstanceNode } from '@plugin/transformers/transformInstanceNode';

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
  transformId: (): string => 'variant-id',
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'frame-id',
    shapeRef: undefined
  }),
  transformComponentIds: (): { id: string; componentId: string } => ({
    id: 'component-shape-id',
    componentId: 'component-id'
  }),
  transformComponentNameAndPath: (): { name: string; path: string } => ({
    name: 'Component',
    path: 'Library/Component'
  }),
  transformInstanceIds: (): { id: string; shapeRef: undefined; componentId: string } => ({
    id: 'instance-id',
    shapeRef: undefined,
    componentId: 'component-id'
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
  transformVariableConsumptionMap: (): Record<string, never> => ({}),
  transformVariantNameAndProperties: (): Record<string, never> => ({})
}));

vi.mock('@plugin/translators/components', () => ({
  registerComponentProperties: vi.fn()
}));

const createFrameNode = (visible: boolean): FrameNode => {
  return {
    id: '1:1',
    name: 'Frame',
    type: 'FRAME',
    visible,
    locked: false,
    clipsContent: false,
    absoluteTransform: [
      [1, 0, 10],
      [0, 1, 20]
    ]
  } as unknown as FrameNode;
};

const createComponentNode = (visible: boolean): ComponentNode => {
  return {
    id: '2:1',
    key: 'component-key',
    name: 'Component',
    type: 'COMPONENT',
    visible,
    locked: false,
    clipsContent: false,
    parent: null,
    setPluginData: vi.fn(),
    getPublishStatusAsync: vi.fn().mockResolvedValue('UNPUBLISHED')
  } as unknown as ComponentNode;
};

const createMainComponent = (): ComponentNode => {
  return {
    id: '3:1',
    key: 'main-component-key',
    name: 'Main component',
    type: 'COMPONENT',
    visible: true,
    locked: false,
    remote: false,
    parent: {} as BaseNode,
    getPluginData: vi.fn().mockReturnValue('')
  } as unknown as ComponentNode;
};

const createInstanceNode = (visible: boolean, mainComponent: ComponentNode): InstanceNode => {
  return {
    id: 'I4:1',
    name: 'Instance',
    type: 'INSTANCE',
    visible,
    locked: false,
    clipsContent: false,
    overrides: [],
    parent: null,
    getMainComponentAsync: vi.fn().mockResolvedValue(mainComponent)
  } as unknown as InstanceNode;
};

describe('artboard visibility export', () => {
  beforeEach(() => {
    clearAllState();

    // @ts-expect-error - Mocking global figma object for transformer tests
    global.figma = {
      root: {
        name: 'Test file'
      }
    };
  });

  it('sets hideInViewer when a frame is hidden in Figma', async () => {
    const result = await transformFrameNode(createFrameNode(false));

    expect(result.hidden).toBe(true);
    expect(result.hideInViewer).toBe(true);
  });

  it('sets hideInViewer when a component is hidden in Figma', async () => {
    const result = await transformComponentNode(createComponentNode(false));

    expect(result.hidden).toBe(true);
    expect(result.hideInViewer).toBe(true);
  });

  it('sets hideInViewer when an instance is hidden in Figma', async () => {
    const mainComponent = createMainComponent();
    const result = await transformInstanceNode(createInstanceNode(false, mainComponent));

    expect(result).toBeDefined();
    expect(result?.hidden).toBe(true);
    expect(result?.hideInViewer).toBe(true);
  });
});
