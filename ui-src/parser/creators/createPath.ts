import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolPathContent, symbolStrokes } from '@ui/parser/creators/symbols';

export const createPath = (
  file: PenpotFile,
  { type, figmaId, figmaRelatedId, ...shape }: PathShape
) => {
  shape.id = parseFigmaId(file, figmaId);
  shape.shapeRef = parseFigmaId(file, figmaRelatedId, true);
  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.content = symbolPathContent(shape.content);

  file.createPath(shape);
};
