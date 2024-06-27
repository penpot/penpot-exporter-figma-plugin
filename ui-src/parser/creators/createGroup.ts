import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { parseFigmaId } from '@ui/parser';
import { symbolTouched } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createGroup = (
  file: PenpotFile,
  { type, children = [], figmaId, figmaRelatedId, ...shape }: GroupShape
) => {
  const { id, shapeRef } = parseFigmaId(file, figmaId);

  shape.id = id;
  shape.shapeRef = shapeRef;
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  file.addGroup(shape);

  createItems(file, children);

  file.closeGroup();
};
