import { ClosePathCommand, Command } from 'svg-path-parser';

import {
  translateCommandsToPathString,
  translateNonRotatedCommand
} from '@plugin/translators/vectors';
import { applyInverseRotation, applyRotationToSegment } from '@plugin/utils';

const isClosePath = (command: Command): command is ClosePathCommand =>
  command.command === 'closepath';

export const translateRotatedCommands = (
  commands: Command[],
  transform: Transform,
  boundingBox: Rect
): string => {
  const referencePoint = applyInverseRotation(
    { x: transform[0][2], y: transform[1][2] },
    transform,
    boundingBox
  );

  return translateCommandsToPathString(
    commands.map(command => {
      const translatedCommand = translateNonRotatedCommand(
        command,
        referencePoint.x,
        referencePoint.y
      );

      if (isClosePath(translatedCommand)) {
        return translatedCommand;
      }

      return applyRotationToSegment(translatedCommand, transform, boundingBox);
    })
  );
};
