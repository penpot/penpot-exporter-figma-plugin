import { PenpotFile } from '@ui/lib/types/penpotFile';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

export const createCircle = (
  file: PenpotFile,
  { type, fills, strokes, blendMode, figmaId, figmaRelatedId, ...rest }: CircleShape
) => {
  file.createCircle({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    strokes: symbolStrokes(strokes),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
