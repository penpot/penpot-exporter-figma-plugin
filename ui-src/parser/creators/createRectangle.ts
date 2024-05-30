import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFillGradients } from '@ui/parser/creators/symbols';

export const createRectangle = (
  file: PenpotFile,
  { type, fills, blendMode, figmaId, figmaRelatedId, ...rest }: RectShape
) => {
  file.createRect({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFillGradients(fills),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
