import { PenpotFile } from '@ui/lib/types/penpotFile';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

export const createCircle = (
  file: PenpotFile,
  { type, fills, strokes, 'blend-mode': blendMode, figmaId, figmaRelatedId, ...rest }: CircleShape
) => {
  file.createCircle({
    'id': parseFigmaId(file, figmaId),
    'shape-ref': parseFigmaId(file, figmaRelatedId, true),
    'fills': symbolFills(fills),
    'strokes': symbolStrokes(strokes),
    'blend-mode': symbolBlendMode(blendMode),
    ...rest
  });
};
