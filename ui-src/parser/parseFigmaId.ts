import { PenpotFile } from '@ui/lib/types/penpotFile';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { identifiers } from '@ui/parser';

export const parseFigmaId = (
  file: PenpotFile,
  figmaId?: string,
  shapeRef: boolean = false
): Uuid | undefined => {
  if (!figmaId) {
    if (shapeRef) return;

    return file.newId();
  }

  const id = identifiers.get(figmaId);

  if (id) {
    return id;
  }

  const newId = file.newId();

  identifiers.set(figmaId, newId);

  return newId;
};
