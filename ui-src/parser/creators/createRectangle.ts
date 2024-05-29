import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { symbolBlendMode, symbolFillGradients } from '@ui/parser/creators/symbols';

export const createRectangle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: RectShape
) => {
  file.createRect({
    fills: symbolFillGradients(fills),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
