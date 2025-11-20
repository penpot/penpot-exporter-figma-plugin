import {
  transformBlend,
  transformConstraints,
  transformEffects,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformSceneNode,
  transformStrokes,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import { translateCommands } from '@plugin/translators/vectors';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

/**
 * In order to match the normal representation of a line in Penpot, we will assume that
 * the line is never rotated, so we calculate its normal position.
 *
 * To represent the line rotated we do take into account the rotation of the line, but only in its content.
 */
export const transformLineNode = (node: LineNode): PathShape => {
  return {
    type: 'path',
    name: node.name,
    content: translateLineNode(node),
    ...transformIds(node),
    ...transformStrokes(node),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformLayoutAttributes(node),
    ...transformConstraints(node),
    ...transformVariableConsumptionMap(node),
    ...transformOverrides(node)
  };
};

const translateLineNode = (node: LineNode): string => {
  return translateCommands(node, [
    {
      x: 0,
      y: 0,
      command: 'moveto',
      code: 'M'
    },
    {
      x: node.width,
      y: 0,
      command: 'lineto',
      code: 'L'
    }
  ]);
};
