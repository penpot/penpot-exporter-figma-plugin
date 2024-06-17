import { Command } from 'svg-path-parser';

import { hasRotation } from '@plugin/utils';

import { translateNonRotatedCommands } from '.';
import { translateRotatedCommands } from './translateRotatedCommands';

export const translateCommands = (node: LayoutMixin, commands: Command[], baseRotation: number) => {
  if (hasRotation(node.rotation + baseRotation) && node.absoluteBoundingBox) {
    return translateRotatedCommands(commands, node.absoluteTransform, node.absoluteBoundingBox);
  }

  return translateNonRotatedCommands(
    commands,
    node.absoluteTransform[0][2],
    node.absoluteTransform[1][2]
  );
};
