import { Command } from 'svg-path-parser';

import { applyBase, translateCommandToPathString } from '@plugin/translators/vectors';
import { applyInverseRotation, applyRotationToSegment } from '@plugin/utils';

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

  return commands
    .reduce((svgPath, command) => {
      const pathString = translateCommandToPathString(
        applyRotationToSegment(
          applyBase(command, referencePoint.x, referencePoint.y),
          transform,
          boundingBox
        )
      );

      return svgPath + pathString + ' ';
    }, '')
    .trimEnd();
};
