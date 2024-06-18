import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

export const createRectangle = (
  file: PenpotFile,
  { type, figmaId, figmaRelatedId, ...shape }: RectShape
) => {
  shape.id = parseFigmaId(file, figmaId);
  shape.shapeRef = parseFigmaId(file, figmaRelatedId, true);
  shape.fills = symbolFills(shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);

  file.createRect(shape);
};
