import {
  transformBlend,
  transformDimension,
  transformFills,
  transformIds,
  transformRotationAndPosition,
  transformSceneNode,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';
import {
  DEFAULT_TABLE_STROKE,
  buildCellFrames,
  buildGridCells,
  computeTableGeometry
} from '@plugin/translators/table';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';

const TABLE_CORNER_RADIUS = 8;

export const transformTableNode = async (
  node: TableNode
): Promise<FrameShape | RectShape | undefined> => {
  try {
    if (!node.absoluteBoundingBox) return rasterFallback(node);
    if (node.numRows === 0 || node.numColumns === 0) return rasterFallback(node);

    const geom = computeTableGeometry(node);
    const cellFrames = buildCellFrames(node, geom);
    const gridCells = buildGridCells(cellFrames, node.numColumns);

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
      children: cellFrames
    };
  } catch (error) {
    console.warn(`Failed to parse table "${node.name}", rasterizing`, error);
    return rasterFallback(node);
  }
};

const rasterFallback = (node: TableNode): Promise<RectShape | undefined> =>
  transformNodeAsImageRect(node);
