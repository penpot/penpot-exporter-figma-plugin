import {
  transformBlend,
  transformDimension,
  transformFills,
  transformIds,
  transformRotationAndPosition,
  transformSceneNode,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import { buildCellFrames, buildGridCells } from '@plugin/transformers/table';
import { DEFAULT_TABLE_STROKE, computeTableGeometry } from '@plugin/translators/table';
import { getRotation } from '@plugin/utils';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';

const TABLE_CORNER_RADIUS = 8;

export const transformTableNode = async (node: TableNode): Promise<FrameShape | undefined> => {
  if (!node.absoluteBoundingBox) return;
  if (node.numRows === 0 || node.numColumns === 0) return;
  if (getRotation(node.absoluteTransform) !== 0) return;

  const geom = computeTableGeometry(node);
  const cells = buildCellFrames(node, geom);
  const gridCells = buildGridCells(cells);

  return {
    type: 'frame',
    name: node.name,
    showContent: false,
    hideInViewer: !node.visible,
    r1: TABLE_CORNER_RADIUS,
    r2: TABLE_CORNER_RADIUS,
    r3: TABLE_CORNER_RADIUS,
    r4: TABLE_CORNER_RADIUS,
    ...transformIds(node),
    ...transformFills(node),
    strokes: [DEFAULT_TABLE_STROKE],
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformVariableConsumptionMap(node),
    layout: 'grid',
    layoutGridDir: 'row',
    layoutGridRows: geom.rowHeights.map(value => ({ type: 'fixed', value })),
    layoutGridColumns: geom.columnWidths.map(value => ({ type: 'fixed', value })),
    layoutGridCells: gridCells,
    children: cells.map(({ frame }) => frame)
  };
};
