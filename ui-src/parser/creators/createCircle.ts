import { PenpotFile } from '@ui/lib/types/penpotFile';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { symbolBlendMode, symbolFillGradients } from '@ui/parser/creators/symbols';

export const createCircle = (
  file: PenpotFile,
  { type, fills, blendMode, ...rest }: CircleShape
) => {
  file.createCircle({
    fills: symbolFillGradients(fills),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
