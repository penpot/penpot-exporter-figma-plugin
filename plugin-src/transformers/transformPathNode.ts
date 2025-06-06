import { parseSVG } from 'svg-path-parser';

import {
  transformBlend,
  transformConstraints,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotation,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';
import { translateCommands } from '@plugin/translators/vectors';

import { PathShape } from '@ui/lib/types/shapes/pathShape';

export const transformPathNode = (node: StarNode | PolygonNode): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translatePathNode(node),
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformRotation(node),
    ...transformLayoutAttributes(node),
    ...transformConstraints(node),
    ...transformOverrides(node)
  };
};

const translatePathNode = (node: StarNode | PolygonNode): string =>
  translateCommands(node, parseSVG(node.fillGeometry[0].data));
