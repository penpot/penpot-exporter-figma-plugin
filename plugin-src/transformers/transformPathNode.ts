import { parseSVG } from 'svg-path-parser';

import {
  transformBlend,
  transformConstraints,
  transformEffects,
  transformFills,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotation,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import { translateCommands } from '@plugin/translators/vectors';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

export const transformPathNode = (node: StarNode | PolygonNode): PathShape | undefined => {
  const content = translatePathNode(node);

  if (content === undefined) {
    return;
  }

  return {
    type: 'path',
    name: node.name,
    content,
    ...transformIds(node),
    ...transformFills(node),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformRotation(node),
    ...transformLayoutAttributes(node),
    ...transformConstraints(node),
    ...transformVariableConsumptionMap(node),
    ...transformOverrides(node)
  };
};

const translatePathNode = (node: StarNode | PolygonNode): string | undefined => {
  const pathData = node.fillGeometry[0]?.data;

  if (!pathData) {
    console.warn('[Penpot Exporter] Missing fillGeometry path data', {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type
    });

    return;
  }

  try {
    return translateCommands(node, parseSVG(pathData));
  } catch (error) {
    console.warn('[Penpot Exporter] Skipping invalid path node', {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      source: 'fillGeometry[0]',
      error: error instanceof Error ? error.message : String(error),
      pathLength: pathData.length
    });

    return;
  }
};
