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

export const transformPathNode = (node: StarNode | PolygonNode): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translatePathNode(node),
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

const translatePathNode = (node: StarNode | PolygonNode): string =>
  translateCommands(node, parseSVG(node.fillGeometry[0].data));
