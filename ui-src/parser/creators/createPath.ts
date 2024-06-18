import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolPathContent, symbolStrokes } from '@ui/parser/creators/symbols';

export const createPath = (
  file: PenpotFile,
  { type, fills, strokes, content, figmaId, figmaRelatedId, ...rest }: PathShape
) => {
  file.createPath({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    strokes: symbolStrokes(strokes),
    content: symbolPathContent(content),
    ...rest
  });
};
