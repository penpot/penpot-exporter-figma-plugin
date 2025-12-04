import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { componentRoots } from '@ui/parser';
import { createArtboard } from '@ui/parser/creators';
import type { ComponentInstance } from '@ui/types';

let unknownFileId: Uuid | undefined = undefined;

export const createComponentInstance = (
  context: PenpotContext,
  { type: _type, ...shape }: ComponentInstance
): void => {
  const componentRoot = componentRoots.get(shape.componentId!);

  shape.componentFile ??= componentRoot ? context.currentFileId : getUnknownFileId(context);

  createArtboard(context, shape);
};

const getUnknownFileId = (context: PenpotContext): Uuid => {
  if (!unknownFileId) {
    unknownFileId = context.genId();
  }

  return unknownFileId;
};
