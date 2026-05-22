import { transformChildIds, transformFills } from '@plugin/transformers/partials';
import { buildCellTextShape } from '@plugin/transformers/table/buildCellTextShape';
import { cellName } from '@plugin/transformers/table/cellName';
import type { TableGeometry } from '@plugin/translators/table/computeTableGeometry';
import { DEFAULT_TABLE_STROKE } from '@plugin/translators/table/defaultTableStroke';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';

export type CellFrame = {
  frame: FrameShape;
  row: number;
  column: number;
};

export const buildCellFrames = (node: TableNode, geom: TableGeometry): CellFrame[] => {
  const cells: CellFrame[] = [];
  const tableX = node.absoluteTransform[0][2];
  const tableY = node.absoluteTransform[1][2];

  for (let row = 0; row < node.numRows; row++) {
    for (let column = 0; column < node.numColumns; column++) {
      const cell = node.cellAt(row, column);
      const cellIndex = row * node.numColumns + column;
      const width = geom.columnWidths[column];
      const height = geom.rowHeights[row];
      const cellX = tableX + geom.xByCol[column];
      const cellY = tableY + geom.yByRow[row];
      const hasText = cell.text.characters.length > 0;

      cells.push({
        row,
        column,
        frame: {
          type: 'frame',
          name: cellName(cell, row, column),
          showContent: true,
          hideInViewer: false,
          blocked: false,
          hidden: false,
          ...transformChildIds(node, cellIndex),
          ...transformFills(cell),
          strokes: [DEFAULT_TABLE_STROKE],
          x: cellX,
          y: cellY,
          width,
          height,
          rotation: 0,
          children: hasText
            ? [buildCellTextShape(node, cell, row, column, cellX, cellY, width, height)]
            : []
        }
      });
    }
  }

  return cells;
};
