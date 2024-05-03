import { PenpotFile } from '@ui/lib/penpot';
import { CircleShape } from '@ui/lib/types/circle/circleShape';

import { translateFillGradients, translateUiBlendMode } from '../translators';

export const createPenpotCircle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: CircleShape
) => {
  file.createCircle({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
