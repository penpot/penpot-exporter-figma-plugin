import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { transformConnectorNode } from '@plugin/transformers/transformConnectorNode';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';

vi.mock('@plugin/transformers/partials', () => ({
  transformChildIds: (): { id: string; shapeRef: undefined } => ({
    id: 'child-id',
    shapeRef: undefined
  }),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'connector-id',
    shapeRef: undefined
  })
}));

vi.mock('@plugin/translators', () => ({
  translateConnectorStrokeCap: vi.fn((cap: string): string | undefined => {
    if (cap === 'NONE') return undefined;
    return 'line-arrow';
  }),
  translateStrokes: vi.fn((): unknown[] => [{ strokeColor: '#000', strokeWidth: 1 }]),
  translateZeroRotation: (): {
    rotation: number;
    transform: undefined;
    transformInverse: undefined;
  } => ({
    rotation: 0,
    transform: undefined,
    transformInverse: undefined
  })
}));

vi.mock('@plugin/translators/text', () => ({
  STYLED_TEXT_SEGMENT_FIELDS: [],
  buildTextContent: (): { type: 'root' } => ({ type: 'root' })
}));

const mockFigma = {
  getNodeByIdAsync: vi.fn()
};
// @ts-expect-error - Mocking the global figma object for tests.
global.figma = mockFigma;

type ConnectorArg = Parameters<typeof transformConnectorNode>[0];

const createConnector = (overrides: Partial<ConnectorNode> = {}): ConnectorArg =>
  ({
    id: '1:1',
    name: 'connector',
    type: 'CONNECTOR',
    visible: true,
    absoluteBoundingBox: { x: 10, y: 20, width: 100, height: 50 } as Rect,
    connectorLineType: 'STRAIGHT',
    connectorStart: { position: { x: 0, y: 0 } },
    connectorEnd: { position: { x: 100, y: 50 } },
    connectorStartStrokeCap: 'NONE',
    connectorEndStrokeCap: 'ARROW_EQUILATERAL',
    text: {
      characters: '',
      fills: [],
      fillStyleId: '',
      getStyledTextSegments: (): unknown[] => []
    },
    strokes: [],
    strokeWeight: 1,
    strokeAlign: 'CENTER',
    dashPattern: [],
    parent: {
      absoluteTransform: [
        [1, 0, 0],
        [0, 1, 0]
      ] as Transform
    },
    ...overrides
  }) as unknown as ConnectorArg;

describe('transformConnectorNode', () => {
  beforeEach(() => {
    mockFigma.getNodeByIdAsync.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns undefined when absoluteBoundingBox is missing', async () => {
    const result = await transformConnectorNode(
      createConnector({ absoluteBoundingBox: null as unknown as Rect })
    );

    expect(result).toBeUndefined();
  });

  it('builds a straight path between free endpoints relative to the parent', async () => {
    const node = createConnector({
      parent: {
        absoluteTransform: [
          [1, 0, 100],
          [0, 1, 200]
        ] as Transform
      } as ConnectorNode['parent']
    });

    const result = (await transformConnectorNode(node)) as PathShape;

    expect(result.type).toBe('path');
    expect(result.content).toBe('M 100 200 L 200 250');
  });

  it('builds an elbowed path with two intermediate segments', async () => {
    const node = createConnector({ connectorLineType: 'ELBOWED' });

    const result = (await transformConnectorNode(node)) as PathShape;

    expect(result.content).toBe('M 0 0 L 50 0 L 50 50 L 100 50');
  });

  it('resolves an attached endpoint using the magnet position on the target node', async () => {
    mockFigma.getNodeByIdAsync.mockResolvedValueOnce({
      absoluteBoundingBox: { x: 500, y: 600, width: 100, height: 50 } as Rect
    });

    const node = createConnector({
      connectorEnd: { endpointNodeId: 'X:1', magnet: 'LEFT' }
    });

    const result = (await transformConnectorNode(node)) as PathShape;

    expect(result.content).toBe('M 0 0 L 500 625');
  });

  it('wraps path and label in a group when the connector has text', async () => {
    const node = createConnector({
      text: {
        characters: 'label',
        fills: [],
        fillStyleId: '',
        getStyledTextSegments: (): unknown[] => []
      } as unknown as ConnectorNode['text']
    });

    const result = (await transformConnectorNode(node)) as GroupShape;

    expect(result.type).toBe('group');
    expect(result.children).toHaveLength(2);
    expect((result.children?.[0] as PathShape).type).toBe('path');
    expect((result.children?.[1] as { type: string }).type).toBe('text');
  });
});
