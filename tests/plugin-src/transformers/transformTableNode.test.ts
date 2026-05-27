import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { transformTableNode } from '@plugin/transformers/transformTableNode';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): { opacity: number } => ({ opacity: 1 }),
  transformChildIds: (_node: unknown, index: number): { id: string; shapeRef: undefined } => ({
    id: `cell-${index}`,
    shapeRef: undefined
  }),
  transformDimension: (): { width: number; height: number } => ({ width: 200, height: 100 }),
  transformFills: (): { fills: never[] } => ({ fills: [] }),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'table-id',
    shapeRef: undefined
  }),
  transformRotationAndPosition: (): { x: number; y: number } => ({ x: 0, y: 0 }),
  transformSceneNode: (): Record<string, never> => ({}),
  transformVariableConsumptionMap: (): Record<string, never> => ({})
}));

vi.mock('@plugin/translators/text', () => ({
  STYLED_TEXT_SEGMENT_FIELDS: [],
  buildTextContent: (): { type: 'root' } => ({ type: 'root' })
}));

let uuidCounter = 0;
vi.mock('@plugin/utils/generateUuid', () => ({
  generateUuid: vi.fn((): string => `uuid-${uuidCounter++}`)
}));

type TableArg = Parameters<typeof transformTableNode>[0];

type CellSpec = {
  width?: number;
  height?: number;
  characters?: string;
  fills?: ReadonlyArray<Paint>;
};

const createTableNode = (
  rows: number,
  columns: number,
  options: {
    cells?: (row: number, column: number) => CellSpec;
    cellAtThrows?: boolean;
    absoluteBoundingBox?: Rect | null;
    absoluteTransform?: Transform;
    rowHeights?: number[];
    columnWidths?: number[];
  } = {}
): TableArg => {
  const {
    cells = (): CellSpec => ({}),
    cellAtThrows = false,
    absoluteBoundingBox = { x: 0, y: 0, width: 200, height: 100 } as Rect,
    absoluteTransform = [
      [1, 0, 0],
      [0, 1, 0]
    ] as Transform,
    rowHeights,
    columnWidths
  } = options;

  const cellAt = vi.fn((row: number, column: number): TableCellNode => {
    if (cellAtThrows) throw new Error('cell-boom');
    const spec = cells(row, column);
    const width = columnWidths ? columnWidths[column] : (spec.width ?? 50);
    const height = rowHeights ? rowHeights[row] : (spec.height ?? 25);
    return {
      type: 'TABLE_CELL',
      rowIndex: row,
      columnIndex: column,
      width,
      height,
      fills: spec.fills ?? [],
      fillStyleId: '',
      text: {
        characters: spec.characters ?? 'cell',
        getStyledTextSegments: () => []
      }
    } as unknown as TableCellNode;
  });

  return {
    id: '7:1',
    name: 'table',
    type: 'TABLE',
    visible: true,
    locked: false,
    numRows: rows,
    numColumns: columns,
    absoluteBoundingBox,
    absoluteTransform,
    width: 200,
    height: 100,
    fills: [],
    cellAt
  } as unknown as TableArg;
};

describe('transformTableNode', () => {
  beforeEach(() => {
    uuidCounter = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a grid-layout frame containing a child frame per cell with a text grandchild', async () => {
    const node = createTableNode(2, 3);
    const result = (await transformTableNode(node)) as FrameShape;

    expect(result.type).toBe('frame');
    expect(result.layout).toBe('grid');
    expect(result.layoutGridDir).toBe('row');
    expect(result.layoutGridRows).toHaveLength(2);
    expect(result.layoutGridColumns).toHaveLength(3);
    expect(Object.keys(result.layoutGridCells ?? {})).toHaveLength(6);
    expect(result.children).toHaveLength(6);

    for (const child of result.children ?? []) {
      const cellFrame = child as FrameShape;
      expect(cellFrame.type).toBe('frame');
      expect(cellFrame.children).toHaveLength(1);
      expect((cellFrame.children?.[0] as TextShape).type).toBe('text');
    }
  });

  it('emits no text child for a cell with empty characters', async () => {
    const node = createTableNode(1, 2, {
      cells: (_r, c) => ({ characters: c === 0 ? '' : 'has text' })
    });
    const result = (await transformTableNode(node)) as FrameShape;

    const [empty, populated] = result.children as [FrameShape, FrameShape];
    expect(empty.children).toHaveLength(0);
    expect(populated.children).toHaveLength(1);
  });

  it('returns undefined when numRows is 0', async () => {
    const result = await transformTableNode(createTableNode(0, 3));

    expect(result).toBeUndefined();
  });

  it('returns undefined when absoluteBoundingBox is null', async () => {
    const result = await transformTableNode(createTableNode(2, 2, { absoluteBoundingBox: null }));

    expect(result).toBeUndefined();
  });

  it('propagates the error when cellAt throws', async () => {
    await expect(transformTableNode(createTableNode(2, 2, { cellAtThrows: true }))).rejects.toThrow(
      'cell-boom'
    );
  });

  it('returns undefined when table is rotated', async () => {
    const result = await transformTableNode(
      createTableNode(2, 2, {
        absoluteTransform: [
          [0, -1, 0],
          [1, 0, 0]
        ] as Transform
      })
    );

    expect(result).toBeUndefined();
  });

  it('positions cell frames using cumulative row heights and column widths', async () => {
    const node = createTableNode(2, 2, {
      rowHeights: [10, 20],
      columnWidths: [30, 40]
    });
    const result = (await transformTableNode(node)) as FrameShape;
    const cells = result.children as FrameShape[];

    expect(cells[0]).toMatchObject({ x: 0, y: 0, width: 30, height: 10 });
    expect(cells[1]).toMatchObject({ x: 30, y: 0, width: 40, height: 10 });
    expect(cells[2]).toMatchObject({ x: 0, y: 10, width: 30, height: 20 });
    expect(cells[3]).toMatchObject({ x: 30, y: 10, width: 40, height: 20 });
  });
});
