import { PenpotFile } from '@ui/lib/types/penpotFile';
import { RectShape } from '@ui/lib/types/shapes/rectShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createRectangle = (file: PenpotFile, { type, figmaId, ...shape }: RectShape) => {
  const { id, shapeRef } = parseFigmaId(file, figmaId);

  shape.id = id;
  shape.shapeRef = shapeRef;
  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  file.createRect(shape);
};
