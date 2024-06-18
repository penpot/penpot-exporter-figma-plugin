import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createArtboard = (
  file: PenpotFile,
  { type, children = [], figmaId, figmaRelatedId, ...shape }: FrameShape
): Uuid | undefined => {
  const id = parseFigmaId(file, figmaId);

  shape.id = id;
  shape.shapeRef ??= parseFigmaId(file, figmaRelatedId, true);
  shape.fills = symbolFills(shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);

  file.addArtboard(shape);

  createItems(file, children);

  file.closeArtboard();

  return id;
};
