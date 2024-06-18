import { PenpotFile } from '@ui/lib/types/penpotFile';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

export const createCircle = (
  file: PenpotFile,
  { type, figmaId, figmaRelatedId, ...shape }: CircleShape
) => {
  shape.id = parseFigmaId(file, figmaId);
  shape.shapeRef = parseFigmaId(file, figmaRelatedId, true);
  shape.fills = symbolFills(shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);

  file.createCircle(shape);
};
