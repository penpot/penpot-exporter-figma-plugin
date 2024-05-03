import { PenpotFile } from '@ui/lib/penpot';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { translateFillGradients, translateUiBlendMode } from '@ui/translators';

export const createPenpotRectangle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: RectShape
) => {
  file.createRect({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
