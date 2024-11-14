import { Command } from 'svg-path-parser';

import { isTransformed } from '@plugin/utils';

import { translateNonRotatedCommands } from '.';
import { translateRotatedCommands } from './translateRotatedCommands';

export const translateCommands = (node: LayoutMixin, commands: Command[]) => {
  if (node.absoluteBoundingBox && isTransformed(node.absoluteTransform, node.absoluteBoundingBox)) {
    return translateRotatedCommands(commands, node.absoluteTransform, node.absoluteBoundingBox);
  }

  return translateNonRotatedCommands(
    commands,
    node.absoluteTransform[0][2],
    node.absoluteTransform[1][2]
  );
};
