import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createArtboard = (
  file: PenpotFile,
  { type, fills, blendMode, children = [], figmaId, figmaRelatedId, shapeRef, ...rest }: FrameShape,
  remote: boolean = false
): Uuid | undefined => {
  const id = parseFigmaId(file, figmaId);

  file.addArtboard({
    id,
    shapeRef: shapeRef ?? parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });

  createItems(file, children, remote);

  file.closeArtboard();

  return id;
};
