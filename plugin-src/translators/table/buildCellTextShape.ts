import { transformChildIds } from '@plugin/transformers/partials';
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
  cellY: number
): TextShape => {
  const segments = cell.text.getStyledTextSegments(STYLED_TEXT_SEGMENT_FIELDS);
  const cellIndex = row * table.numColumns + column;
  const textIndex = table.numRows * table.numColumns + cellIndex;

  const width = Math.max(0, cell.width - CELL_PADDING_X * 2);
  const height = Math.max(0, cell.height - CELL_PADDING_Y * 2);

  return {
    type: 'text',
    name: cell.text.characters.slice(0, 64) || `R${row + 1}C${column + 1}`,
    blocked: false,
    hidden: false,
    ...transformChildIds(table, textIndex),
    characters: cell.text.characters,
    content: buildTextContent(cell.text, segments, 'left', 'center'),
    growType: 'fixed',
    x: cellX + CELL_PADDING_X,
    y: cellY + CELL_PADDING_Y,
    width,
    height,
    rotation: 0
  };
};
