const MAX_NAME_LENGTH = 64;

export const cellName = (cell: TableCellNode, row: number, column: number): string =>
  cell.text.characters.slice(0, MAX_NAME_LENGTH) || `R${row + 1}C${column + 1}`;
