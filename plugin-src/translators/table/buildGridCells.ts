import { generateUuid } from '@plugin/utils/generateUuid';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { GridCell } from '@ui/lib/types/shapes/layout';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export const buildGridCells = (
  cellFrames: FrameShape[],
  numColumns: number
): { [uuid: Uuid]: GridCell } => {
  const cells: { [uuid: Uuid]: GridCell } = {};

  cellFrames.forEach((frame, index) => {
    const row = Math.floor(index / numColumns);
    const column = index % numColumns;
    const id = generateUuid();

    cells[id] = {
      id,
      row: row + 1,
      column: column + 1,
      rowSpan: 1,
      columnSpan: 1,
      position: 'manual',
      alignSelf: 'stretch',
      justifySelf: 'stretch',
      shapes: frame.id ? [frame.id] : []
    };
  });

  return cells;
};
