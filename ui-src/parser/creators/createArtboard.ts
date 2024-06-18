import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createArtboard = (
  file: PenpotFile,
  { type, fills, strokes, children = [], figmaId, figmaRelatedId, shapeRef, ...rest }: FrameShape
): Uuid | undefined => {
  const id = parseFigmaId(file, figmaId);

  file.addArtboard({
    id,
    shapeRef: shapeRef ?? parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    strokes: symbolStrokes(strokes),
    ...rest
  });

  createItems(file, children);

  file.closeArtboard();

  return id;
};
