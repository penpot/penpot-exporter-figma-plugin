import { PenpotFile } from '@ui/lib/types/penpotFile';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { Uuid } from '@ui/lib/types/utils/uuid';

import { translateFillGradients, translateUiBlendMode } from '../translators';

export const createPenpotCircle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: CircleShape
): Uuid => {
  return file.createCircle({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
