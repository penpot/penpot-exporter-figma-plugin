import { type Command } from 'svg-path-parser';

import { transformIds, transformSceneNode } from '@plugin/transformers/partials';
import { translateZeroRotation } from '@plugin/translators';
import { translateFills } from '@plugin/translators/fills';
import {
  computePathBounds,
  extractDrawablePaths,
  parseDrawables
} from '@plugin/translators/shapeWithText';
import { serializeCommands } from '@plugin/translators/vectors';

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

  const subpaths = parseDrawables(drawables, pathData => {
    console.warn('Skipping connector subpath with invalid SVG', {
      nodeId: node.id,
      nodeName: node.name,
      pathData
    });
  });
  const bounds = computePathBounds(subpaths);
  if (!bounds) return;

  const toCanvas: Transform = [
    [1, 0, aabb.x - bounds.minX],
    [0, 1, aabb.y - bounds.minY]
  ];
  const content = serializeAll(subpaths, toCanvas);
  if (!content) return;

  return {
    type: 'path',
    name: node.name,
    content,
    ...transformIds(node),
    fills: translateFills(node.strokes),
    strokes: [],
    ...translateZeroRotation(),
    ...transformSceneNode(node)
  };
};

const serializeAll = (subpaths: Command[][], toCanvas: Transform): string =>
  subpaths
    .map(commands => serializeCommands(commands, toCanvas))
    .join(' ')
    .trim();

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
