import { PenpotFile } from '@ui/lib/types/penpotFile';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { identifiers, swaps } from '@ui/parser';

export const parseFigmaId = (
  file: PenpotFile,
  figmaId?: string
): { id: Uuid; shapeRef: Uuid | undefined } => {
  const realFigmaId = calculateRealFigmaId(figmaId);

  return {
    id: parseId(file, realFigmaId),
    shapeRef: parseShapeRef(file, realFigmaId)
  };
};

const parseId = (file: PenpotFile, figmaId?: string): Uuid => {
  if (!figmaId) {
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

const parseShapeRef = (file: PenpotFile, figmaId: string | undefined): Uuid | undefined => {
  if (!figmaId) return;

  const figmaRelatedId = getRelatedNodeId(figmaId);

  if (!figmaRelatedId) {
    return;
  }

  const id = identifiers.get(figmaRelatedId);

  if (id) {
    return id;
  }

  const newId = file.newId();

  identifiers.set(figmaRelatedId, newId);

  return newId;
};

const getRelatedNodeId = (nodeId: string): string | undefined => {
  const ids = nodeId.split(';');

  if (ids.length > 1) {
    return ids.slice(1).join(';');
  }
};

const calculateRealFigmaId = (figmaId: string | undefined): string | undefined => {
  if (!figmaId) return;

  while (swaps.length > 0) {
    const swap = swaps[swaps.length - 1];

    if (figmaId.startsWith(swap.original) || figmaId.replace('M', '').startsWith(swap.original)) {
      return figmaId.replace(swap.original, swap.swapped);
    }

    swaps.pop();
  }

  return figmaId;
};
