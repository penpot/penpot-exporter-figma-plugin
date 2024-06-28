import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createArtboard = (
  file: PenpotFile,
  { type, children = [], figmaId, figmaRelatedId, ...shape }: FrameShape
): Uuid | undefined => {
  const id = parseFigmaId(file, figmaId);

  shape.id = id;
  shape.shapeRef ??= parseFigmaId(file, figmaRelatedId, true);
  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  file.addArtboard(shape);

  createItems(file, children);

  file.closeArtboard();

  return id;
};
