import { PenpotFile } from '@ui/lib/types/penpotFile';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { parseFigmaId } from '@ui/parser';
import {
  symbolBoolType,
  symbolFills,
  symbolStrokes,
  symbolTouched
} from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createBool = (
  file: PenpotFile,
  { type, figmaId, children = [], ...shape }: BoolShape
) => {
  const { id, shapeRef } = parseFigmaId(file, figmaId);

  shape.id = id;
  shape.shapeRef = shapeRef;
  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.boolType = symbolBoolType(shape.boolType);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  file.addBool(shape);

  createItems(file, children);

  file.closeBool();
};
