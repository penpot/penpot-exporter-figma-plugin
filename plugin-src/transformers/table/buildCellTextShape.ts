import { transformChildIds } from '@plugin/transformers/partials';
import { cellName } from '@plugin/transformers/table/cellName';
import { STYLED_TEXT_SEGMENT_FIELDS, buildTextContent } from '@plugin/translators/text';

import type { TextShape } from '@ui/lib/types/shapes/textShape';

const CELL_PADDING_X = 8;
const CELL_PADDING_Y = 4;

export const buildCellTextShape = (
  table: TableNode,
  cell: TableCellNode,
  row: number,
  column: number,
  cellX: number,
  cellY: number,
  cellWidth: number,
  cellHeight: number
): TextShape => {
  const segments = cell.text.getStyledTextSegments(STYLED_TEXT_SEGMENT_FIELDS);
  const cellIndex = row * table.numColumns + column;
  const textIndex = table.numRows * table.numColumns + cellIndex;

  return {
    type: 'text',
    name: cellName(cell, row, column),
    blocked: false,
    hidden: false,
    ...transformChildIds(table, textIndex),
    characters: cell.text.characters,
    content: buildTextContent(cell.text, segments, 'left', 'center'),
    growType: 'fixed',
    x: cellX + CELL_PADDING_X,
    y: cellY + CELL_PADDING_Y,
    width: Math.max(0, cellWidth - CELL_PADDING_X * 2),
    height: Math.max(0, cellHeight - CELL_PADDING_Y * 2),
    rotation: 0
  };
};
