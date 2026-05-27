import type { CellFrame } from '@plugin/transformers/table/buildCellFrames';
import { generateUuid } from '@plugin/utils/generateUuid';

import type { GridCell } from '@ui/lib/types/shapes/layout';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export const buildGridCells = (cells: CellFrame[]): { [uuid: Uuid]: GridCell } => {
  const gridCells: { [uuid: Uuid]: GridCell } = {};

  for (const { frame, row, column } of cells) {
    const id = generateUuid();

    gridCells[id] = {
      id,
      row: row + 1,
      column: column + 1,
      rowSpan: 1,
      columnSpan: 1,
      position: 'manual',
      alignSelf: 'stretch',
      justifySelf: 'stretch',
      shapes: [frame.id]
    };
  }

  return gridCells;
};
