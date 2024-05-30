import { PenpotFile } from '@ui/lib/types/penpotFile';
import { Uuid } from '@ui/lib/types/utils/uuid';

import { idLibrary } from '.';

export const parseFigmaId = (
  file: PenpotFile,
  figmaId?: string,
  shapeRef: boolean = false
): Uuid | undefined => {
  if (!figmaId) {
    if (shapeRef) {
      return;
    }

    return file.newId();
  }

  const id = idLibrary.get(figmaId);
  if (id) {
    return id;
  }

  const newId = file.newId();
  idLibrary.register(figmaId, newId);
  return newId;
};
