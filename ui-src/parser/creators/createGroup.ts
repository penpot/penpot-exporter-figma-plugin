import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { parseFigmaId } from '@ui/parser';

import { createItems } from '.';

export const createGroup = (
  file: PenpotFile,
  { type, children = [], figmaId, figmaRelatedId, ...rest }: GroupShape
) => {
  file.addGroup({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    ...rest
  });

  createItems(file, children);

  file.closeGroup();
};
