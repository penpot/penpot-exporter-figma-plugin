import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

export const createRectangle = (
  file: PenpotFile,
  { type, fills, strokes, 'blend-mode': blendMode, figmaId, figmaRelatedId, ...rest }: RectShape
) => {
  file.createRect({
    'id': parseFigmaId(file, figmaId),
    'shape-ref': parseFigmaId(file, figmaRelatedId, true),
    'fills': symbolFills(fills),
    'strokes': symbolStrokes(strokes),
    'blend-mode': symbolBlendMode(blendMode),
    ...rest
  });
};
