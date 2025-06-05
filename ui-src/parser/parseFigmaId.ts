import { PenpotContext } from '@ui/lib/types/penpotContext';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { identifiers } from '@ui/parser';

export const parseFigmaId = (
  context: PenpotContext,
  figmaId?: string,
  shapeRef: boolean = false
): Uuid | undefined => {
  if (!figmaId) {
    if (shapeRef) return;

    return context.genId();
  }

  const id = identifiers.get(figmaId);

  if (id) {
    return id;
  }

  const newId = context.genId();

  identifiers.set(figmaId, newId);

  return newId;
};
