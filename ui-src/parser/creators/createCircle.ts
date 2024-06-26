import { PenpotFile } from '@ui/lib/types/penpotFile';
import { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createCircle = (
  file: PenpotFile,
  { type, figmaId, figmaRelatedId, ...shape }: CircleShape
) => {
  shape.id = parseFigmaId(file, figmaId);
  shape.shapeRef = parseFigmaId(file, figmaRelatedId, true);
  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  file.createCircle(shape);
};
