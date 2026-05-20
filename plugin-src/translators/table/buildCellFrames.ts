import { transformChildIds, transformFills } from '@plugin/transformers/partials';
import { buildCellTextShape } from '@plugin/translators/table/buildCellTextShape';
import type { TableGeometry } from '@plugin/translators/table/computeTableGeometry';
import { DEFAULT_TABLE_STROKE } from '@plugin/translators/table/defaultTableStroke';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';

export const buildCellFrames = (node: TableNode, geom: TableGeometry): FrameShape[] => {
  const frames: FrameShape[] = [];
  const tableX = node.absoluteTransform[0][2];
  const tableY = node.absoluteTransform[1][2];

  for (let row = 0; row < node.numRows; row++) {
    for (let column = 0; column < node.numColumns; column++) {
      const cell = node.cellAt(row, column);
      const cellIndex = row * node.numColumns + column;
      const hasText = cell.text.characters.length > 0;
      const cellX = tableX + geom.xByCol[column];
      const cellY = tableY + geom.yByRow[row];

      frames.push({
        type: 'frame',
        name: cell.text.characters.slice(0, 64) || `R${row + 1}C${column + 1}`,
        showContent: true,
        hideInViewer: false,
        blocked: false,
        hidden: false,
        ...transformChildIds(node, cellIndex),
        ...transformFills(cell),
        strokes: [DEFAULT_TABLE_STROKE],
        x: cellX,
        y: cellY,
        width: cell.width,
        height: cell.height,
        rotation: 0,
        children: hasText ? [buildCellTextShape(node, cell, row, column, cellX, cellY)] : []
      });
    }
  }

  return frames;
};
