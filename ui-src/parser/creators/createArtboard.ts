import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createArtboard = (
  file: PenpotFile,
  {
    type,
    fills,
    strokes,
    children = [],
    figmaId,
    'blend-mode': blendMode,
    'shape-ref': shapeRef,
    figmaRelatedId,
    ...rest
  }: FrameShape
): Uuid | undefined => {
  const id = parseFigmaId(file, figmaId);

  file.addArtboard({
    id,
    'shape-ref': shapeRef ?? parseFigmaId(file, figmaRelatedId, true),
    'fills': symbolFills(fills),
    'strokes': symbolStrokes(strokes),
    'blend-mode': symbolBlendMode(blendMode),
    ...rest
  });

  createItems(file, children);

  file.closeArtboard();

  return id;
};
