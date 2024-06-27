import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { parseFigmaId } from '@ui/parser';
import {
  symbolFills,
  symbolPathContent,
  symbolStrokes,
  symbolTouched
} from '@ui/parser/creators/symbols';

export const createPath = (file: PenpotFile, { type, figmaId, ...shape }: PathShape) => {
  const { id, shapeRef } = parseFigmaId(file, figmaId);

  shape.id = id;
  shape.shapeRef = shapeRef;
  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.content = symbolPathContent(shape.content);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  file.createPath(shape);
};
