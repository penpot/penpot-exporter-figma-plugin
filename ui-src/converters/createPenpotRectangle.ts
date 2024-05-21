import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { translateFillGradients, translateUiBlendMode } from '@ui/translators';

export const createPenpotRectangle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: RectShape
): Uuid => {
  return file.createRect({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
