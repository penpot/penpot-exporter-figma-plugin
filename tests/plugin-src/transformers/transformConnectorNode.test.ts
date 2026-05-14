import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformConnectorNode } from '@plugin/transformers/transformConnectorNode';
import type * as translators from '@plugin/translators';

type ConnectorArg = Parameters<typeof transformConnectorNode>[0];

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): Record<string, never> => ({}),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'connector-id',
    shapeRef: undefined
  }),
  transformSceneNode: (node: { locked?: boolean; visible: boolean }): Record<string, boolean> => ({
    blocked: Boolean(node.locked),
    hidden: !node.visible
  })
}));

vi.mock('@plugin/translators/fills', () => ({
  translateFills: (): never[] => []
}));

vi.mock('@plugin/translators', async importOriginal => {
  const actual = await importOriginal<typeof translators>();
  return {
    ...actual,
    translateStrokes: (): never[] => [],
    translateZeroRotation: (): { rotation: number } => ({ rotation: 0 })
  };
});

const baseConnector = (overrides: Partial<ConnectorArg> = {}): ConnectorArg => {
  return {
    id: '20:1',
    name: 'Connector',
    type: 'CONNECTOR',
    visible: true,
    locked: false,
    width: 100,
    height: 50,
    connectorLineType: 'STRAIGHT',
    absoluteTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ],
    relativeTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ],
    connectorStart: { position: { x: 0, y: 0 } },
    connectorEnd: { position: { x: 100, y: 50 } },
    connectorStartStrokeCap: 'NONE',
    connectorEndStrokeCap: 'ARROW_EQUILATERAL',
    text: {
      characters: '',
      fontName: { family: 'Inter', style: 'Regular' },
      fills: []
    },
    textBackground: { fills: [] },
    strokes: [],
    strokeWeight: 1,
    strokeAlign: 'CENTER',
    dashPattern: [],
    opacity: 1,
    blendMode: 'NORMAL',
    ...overrides
  } as unknown as ConnectorArg;
};

describe('transformConnectorNode', () => {
  beforeEach(() => {
    clearAllState();
    vi.clearAllMocks();

    // @ts-expect-error - Mocking global figma for connector tests
    global.figma = {
      getNodeByIdAsync: vi.fn(async () => null),
      mixed: Symbol('mixed')
    };
  });

  it('returns a PathShape when the connector has no label text', async () => {
    const result = await transformConnectorNode(baseConnector());

    expect(result?.type).toBe('path');
    expect((result as { content: string }).content).toBe('M 0 0 L 100 50');
  });

  it('builds an elbowed path for ELBOWED connectors', async () => {
    const result = await transformConnectorNode(
      baseConnector({ connectorLineType: 'ELBOWED' } as Partial<ConnectorArg>)
    );

    // dx (100) > dy (50) → horizontal-first elbow with mx = 50
    expect((result as { content: string }).content).toBe('M 0 0 L 50 0 L 50 50 L 100 50');
  });

  it('returns a GroupShape when the connector has a label', async () => {
    const result = await transformConnectorNode(
      baseConnector({
        text: {
          characters: 'label',
          fontName: { family: 'Inter', style: 'Regular' },
          fills: []
        }
      } as unknown as Partial<ConnectorArg>)
    );

    expect(result?.type).toBe('group');
    expect((result as { children: { type: string }[] }).children.length).toBeGreaterThanOrEqual(2);
    expect((result as { children: { type: string }[] }).children.some(c => c.type === 'path')).toBe(
      true
    );
    expect((result as { children: { type: string }[] }).children.some(c => c.type === 'text')).toBe(
      true
    );
  });

  it('resolves endpoint nodes via figma.getNodeByIdAsync', async () => {
    const targetBbox = { x: 200, y: 100, width: 40, height: 40 };
    // @ts-expect-error - Mocking global figma for connector test
    global.figma = {
      getNodeByIdAsync: vi.fn(async (id: string) => {
        if (id === 'target-node') {
          return { absoluteBoundingBox: targetBbox };
        }
        return null;
      }),
      mixed: Symbol('mixed')
    };

    const result = await transformConnectorNode(
      baseConnector({
        connectorEnd: {
          endpointNodeId: 'target-node',
          magnet: 'LEFT'
        }
      } as Partial<ConnectorArg>)
    );

    // LEFT magnet on bbox(200,100,40,40) → (200, 120)
    expect((result as { content: string }).content).toBe('M 0 0 L 200 120');
  });

  it('skips the connector and warns when an endpoint cannot be resolved', async () => {
    // @ts-expect-error - Mocking global figma for connector test
    global.figma = {
      getNodeByIdAsync: vi.fn(async () => null),
      mixed: Symbol('mixed')
    };
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await transformConnectorNode(
      baseConnector({
        connectorEnd: { endpointNodeId: 'missing', magnet: 'CENTER' }
      } as Partial<ConnectorArg>)
    );

    expect(result).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unresolvable'));

    warnSpy.mockRestore();
  });
});
