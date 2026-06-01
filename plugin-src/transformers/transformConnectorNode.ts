import { transformIds, transformSceneNode } from '@plugin/transformers/partials';
import { translateZeroRotation } from '@plugin/translators';
import { translateFills } from '@plugin/translators/fills';
import {
  buildPathContentFromDrawables,
  extractDrawablePaths
} from '@plugin/translators/shapeWithText';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

// FigJam exports connectors as a single filled <path> (line, arrowheads, and
// caps are all closed subpaths filled with the stroke colour — no <stroke> on
// the SVG). Mirror that: render as a single filled PathShape, no strokes.
export const transformConnectorNode = async (
  node: ConnectorNode
): Promise<PathShape | undefined> => {
  const aabb = node.absoluteBoundingBox;
  if (!aabb) return;

  const svg = await exportSvg(node);
  if (!svg) return;

  const drawables = extractDrawablePaths(svg);
  if (drawables.length === 0) return;

  const result = buildPathContentFromDrawables(drawables, aabb, pathData => {
    console.warn('Skipping connector subpath with invalid SVG', {
      nodeId: node.id,
      nodeName: node.name,
      pathData
    });
  });
  if (!result) return;

  return {
    type: 'path',
    name: node.name,
    content: result.content,
    ...transformIds(node),
    fills: translateFills(node.strokes),
    strokes: [],
    ...translateZeroRotation(),
    ...transformSceneNode(node)
  };
};

const exportSvg = async (node: ConnectorNode): Promise<string | undefined> => {
  try {
    return await node.exportAsync({
      format: 'SVG_STRING',
      svgOutlineText: true,
      svgIdAttribute: false
    });
  } catch (error) {
    console.warn(`Failed to export connector "${node.name}" as SVG`, error);
    return;
  }
};
