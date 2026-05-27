export type TableGeometry = {
  rowHeights: number[];
  columnWidths: number[];
  xByCol: number[];
  yByRow: number[];
};

export const computeTableGeometry = (node: TableNode): TableGeometry => {
  const columnWidths: number[] = [];
  const xByCol: number[] = [];
  let cursorX = 0;
  for (let c = 0; c < node.numColumns; c++) {
    const width = node.cellAt(0, c).width;
    columnWidths.push(width);
    xByCol.push(cursorX);
    cursorX += width;
  }

  const rowHeights: number[] = [];
  const yByRow: number[] = [];
  let cursorY = 0;
  for (let r = 0; r < node.numRows; r++) {
    const height = node.cellAt(r, 0).height;
    rowHeights.push(height);
    yByRow.push(cursorY);
    cursorY += height;
  }

  return { rowHeights, columnWidths, xByCol, yByRow };
};
