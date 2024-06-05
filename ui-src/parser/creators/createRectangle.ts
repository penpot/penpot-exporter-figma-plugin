import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

export const createRectangle = (
  file: PenpotFile,
  { type, fills, strokes, blendMode, figmaId, figmaRelatedId, ...rest }: RectShape
) => {
  file.createRect({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    strokes: symbolStrokes(strokes),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
