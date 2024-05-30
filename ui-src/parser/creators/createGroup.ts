import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createGroup = (
  file: PenpotFile,
  { type, blendMode, children = [], figmaId, figmaRelatedId, ...rest }: GroupShape
) => {
  file.addGroup({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });

  createItems(file, children);

  file.closeGroup();
};
