import { PenpotFile } from '@ui/lib/types/penpotFile';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFillGradients } from '@ui/parser/creators/symbols';

export const createCircle = (
  file: PenpotFile,
  { type, fills, blendMode, figmaId, figmaRelatedId, ...rest }: CircleShape
) => {
  file.createCircle({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFillGradients(fills),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
